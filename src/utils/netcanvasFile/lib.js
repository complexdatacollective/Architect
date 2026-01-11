import uuid from 'uuid';
import { electronAPI } from '@utils/electronBridge';
import { pruneProtocol } from '@app/utils/prune';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import { errors, handleError } from './errors';

/**
 * Essentially the same as path.join, but also creates the directory.
 * @returns {Promise} Resolves to path as a string
 */
const getTempDir = async (...args) => {
  const tempPath = await electronAPI.app.getPath('temp');
  const dirPath = await electronAPI.path.join(tempPath, 'architect', ...args);
  await electronAPI.fs.mkdirp(dirPath);
  return dirPath;
};

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} workingPath The protocol directory.
 * @returns {object} The protocol as an object
 */
const readProtocol = async (workingPath) => {
  const protocolJsonPath = await electronAPI.path.join(workingPath, 'protocol.json');

  try {
    return await electronAPI.fs.readJson(protocolJsonPath);
  } catch (error) {
    throw handleError(errors.ReadError)(error);
  }
};

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`.
 * Removes assets that aren't referenced in the protocol, and removes any
 * unsuported JSON values.
 * @param {string} workingPath The protocol directory.
 * @param {object} protocol the protocol data to write
 * @returns {Promise}
 */
const writeProtocol = async (workingPath, protocol) => {
  const protocolJsonPath = await electronAPI.path.join(workingPath, 'protocol.json');

  const protocolWithDate = {
    ...protocol,
    lastModified: new Date().toISOString(),
  };

  try {
    const prunedProtocol = await pruneProtocol(protocolWithDate);
    await electronAPI.fs.writeJson(protocolJsonPath, prunedProtocol, { spaces: 2 });
    await pruneProtocolAssets(workingPath);
    return prunedProtocol;
  } catch (error) {
    throw handleError(errors.WriteError)(error);
  }
};

/**
 * Move a netcanvas file located in temporary directory into user space.
 * If the destination exists, make a backup copy of that file.
 *
 * @param netcanvasExportPath .netcanvas file path in temp
 * @param destinationUserPath Destination path
 * @returns {Promise} Resolves to { savePath, backupPath } if successful
 */
const deployNetcanvas = async (netcanvasExportPath, destinationUserPath) => {
  const createBackup = true;
  const f = await electronAPI.path.parse(destinationUserPath);
  const backupPath = await electronAPI.path.join(f.dir, `${f.name}.backup-${new Date().getTime()}${f.ext}`);

  const exists = await electronAPI.fs.pathExists(destinationUserPath);

  let createdBackup = false;
  if (exists && createBackup) {
    await electronAPI.fs.rename(destinationUserPath, backupPath);
    createdBackup = true;
  }

  await electronAPI.fs.copy(netcanvasExportPath, destinationUserPath);

  return {
    savePath: destinationUserPath,
    backupPath: createdBackup ? backupPath : null,
  };
};

const commitNetcanvas = async ({ savePath, backupPath }) => {
  if (!backupPath) { return savePath; }
  // Check the new file definitely exists before deleting backup
  const stat = await electronAPI.fs.stat(savePath);
  if (!stat.isFile) {
    throw new Error(`"${savePath}" (savePath) does not exist`);
  }
  await electronAPI.fs.unlink(backupPath);
  return savePath;
};

const revertNetcanvas = async ({ savePath, backupPath }) => {
  if (!backupPath) { return savePath; } // Nothing to revert
  // Check the backup definitely exists before deleting other file
  const stat = await electronAPI.fs.stat(backupPath);
  if (!stat.isFile) {
    throw new Error(`"${backupPath}" (backupPath) does not exist`);
  }
  await electronAPI.fs.unlink(savePath);
  await electronAPI.fs.rename(backupPath, savePath);
  return savePath;
};

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object (optional)
 * @returns {Promise} Resolves to a path in temp (random)
 */
const createNetcanvasExport = async (workingPath, protocol) => {
  if (!protocol) { throw new Error('Protocol is required'); }

  await writeProtocol(workingPath, protocol);
  const exportDir = await getTempDir('exports');
  const exportPath = await electronAPI.path.join(exportDir, uuid());

  await archive(workingPath, exportPath);
  return exportPath;
};

/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath .netcanvas file path
 * @returns {Promise} Resolves to a path in temp (random)
 */
const importNetcanvas = async (filePath) => {
  try {
    const protocolsDir = await getTempDir('protocols');
    const destinationPath = await electronAPI.path.join(protocolsDir, uuid());

    const canAccess = await electronAPI.fs.access(filePath);
    if (!canAccess) {
      throw new Error(`Cannot access file: ${filePath}`);
    }

    await extract(filePath, destinationPath);
    return destinationPath;
  } catch (error) {
    throw handleError(errors.OpenFailed)(error);
  }
};

export {
  commitNetcanvas,
  createNetcanvasExport,
  deployNetcanvas,
  getTempDir,
  readProtocol,
  revertNetcanvas,
  writeProtocol,
  importNetcanvas,
};
