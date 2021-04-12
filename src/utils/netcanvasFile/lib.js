import { remote } from 'electron';
import fse from 'fs-extra';
import path from 'path';
import uuid from 'uuid';
import { pruneProtocol } from '@app/utils/prune';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import { errors, handleError } from './errors';

/**
 * Essentially the same as path.join, but also creates the directory.
 * @returns {Promise} Resolves to path as a string
 */
const getTempDir = (...args) => {
  const dirPath = path.join(remote.app.getPath('temp'), 'architect', ...args);
  return fse.mkdirp(dirPath)
    .then(() => dirPath);
};

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} workingPath The protocol directory.
 * @returns {object} The protocol as an object
 */
const readProtocol = (workingPath) => {
  const protocolJsonPath = path.join(workingPath, 'protocol.json');

  return fse.readJson(protocolJsonPath)
    .catch(handleError(errors.ReadError));
};

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`.
 * Removes assets that aren't referenced in the protocol, and removes any
 * unsuported JSON values.
 * @param {string} workingPath The protocol directory.
 * @param {object} protocol the protocol data to write
 * @returns {Promise}
 */
const writeProtocol = (workingPath, protocol) => {
  const protocolJsonPath = path.join(workingPath, 'protocol.json');

  const protocolWithDate = {
    ...protocol,
    lastModified: new Date().toISOString(),
  };

  return Promise.resolve()
    .then(() => pruneProtocol(protocolWithDate))
    .then((prunedProtocol) => fse.writeJson(protocolJsonPath, prunedProtocol, { spaces: 2 })
      .catch(handleError(errors.WriteError))
      .then(() => pruneProtocolAssets(workingPath))
      .then(() => prunedProtocol));
};

/**
 * Move a netcanvas file located in temporary directory into user space.
 * If the destination exists, make a backup copy of that file.
 *
 * @param netcanvasExportPath .netcanvas file path in temp
 * @param destinationUserPath Destination path
 * @returns {Promise} Resolves to { savePath, backupPath } if successful
 */
const deployNetcanvas = (netcanvasExportPath, destinationUserPath) => {
  const createBackup = true;
  const f = path.parse(destinationUserPath);
  const backupPath = path.join(f.dir, `${f.name}.backup-${new Date().getTime()}${f.ext}`);

  return fse.pathExists(destinationUserPath)
    .then((exists) => {
      if (!exists || !createBackup) { return false; }

      return fse.rename(destinationUserPath, backupPath)
        .then(() => true);
    })
    .then((createdBackup) => fse.copy(netcanvasExportPath, destinationUserPath)
      .then(() => ({
        savePath: destinationUserPath,
        backupPath: createdBackup ? backupPath : null,
      })));
};

const commitNetcanvas = ({ savePath, backupPath }) => {
  if (!backupPath) { return Promise.resolve(savePath); }
  // Check the new file definitely exists before deleting backup
  return fse.stat(savePath)
    .then((stat) => {
      if (!stat.isFile()) { throw new Error(`"${savePath}" (savePath) does not exist`); }
      return fse.unlink(backupPath)
        .then(() => savePath);
    });
};

const revertNetcanvas = ({ savePath, backupPath }) => {
  if (!backupPath) { return Promise.resolve(savePath); } // Nothing to revert
  // Check the backup definitely exists before deleting other file
  return fse.stat(backupPath)
    .then((stat) => {
      if (!stat.isFile()) { throw new Error(`"${backupPath}" (backupPath) does not exist`); }
      return fse.unlink(savePath)
        .then(() => fse.rename(backupPath, savePath))
        .then(() => savePath);
    });
};

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object (optional)
 * @returns {Promise} Resolves to a path in temp (random)
 */
const createNetcanvasExport = (workingPath, protocol) => {
  if (!protocol) { return Promise.reject(); }

  return writeProtocol(workingPath, protocol)
    .then(() => getTempDir('exports'))
    .then((exportDir) => {
      const exportPath = path.join(exportDir, uuid());

      return archive(workingPath, exportPath)
        .then(() => exportPath);
    });
};

/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath .netcanvas file path
 * @returns {Promise} Resolves to a path in temp (random)
 */
const importNetcanvas = (filePath) => getTempDir('protocols')
  .then((protocolsDir) => {
    const destinationPath = path.join(protocolsDir, uuid());

    return fse.access(filePath, fse.constants.W_OK)
      .then(() => extract(filePath, destinationPath))
      .then(() => destinationPath)
      .catch(handleError(errors.OpenFailed));
  });

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
