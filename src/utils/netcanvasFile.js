import { remote } from 'electron';
import fse from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import uuid from 'uuid';
import { APP_SCHEMA_VERSION } from '@app/config';
import pruneAssets from '@app/utils/protocols/pruneAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import validateProtocol from '@app/utils/validateProtocol';

export const errors = {
  MissingPermissions: new Error('Protocol does not have read/write permissions'),
  ExtractFailed: new Error('Protocol could not be extracted'),
  BackupFailed: new Error('Protocol could not be backed up'),
  SaveFailed: new Error('Protocol could not be saved to destination'),
  PruneFailed: new Error('Protocol assets could not be updated'),
  ArchiveFailed: new Error('Protocol could not be archived'),
  MissingProtocolJson: new Error('Protocol does not have a json file'),
  ProtocolJsonParseError: new Error('Protocol json could not be parsed'),
  NetcanvasCouldNotValidate: new Error('Netcanvas file could not be validated'),
  NetcanvasValidationError: new Error('Netcanvas file did not validate'),
};

const throwHumanReadableError = readableError =>
  (e) => {
    log.error(e);
    throw readableError;
  };

const getStringifiedProtocol = protocol =>
  new Promise((resolve, reject) => {
    try {
      return resolve(JSON.stringify(protocol, null, 2));
    } catch (e) {
      log.error(e);
      return reject(e);
    }
  });

const getTempDir = (...args) => {
  const dirPath = path.join(remote.app.getPath('temp'), 'architect', ...args);
  return fse.mkdirp(dirPath)
    .then(() => dirPath);
};

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object (optional)
 */
export const createNetcanvasExport = (workingPath, protocol) => {
  const protocolJsonPath = path.join(workingPath, 'protocol.json');

  return getTempDir('exports')
    .then((exportDir) => {
      const exportPath = path.join(exportDir, uuid());
      return Promise.resolve()
        .then(() => {
          if (!protocol) { return null; }

          return getStringifiedProtocol(protocol)
            .then(protocolData => fse.writeFile(protocolJsonPath, protocolData))
            .catch(throwHumanReadableError(errors.SaveFailed));
        })
        .then(() =>
          pruneAssets(workingPath)
            .catch(throwHumanReadableError(errors.PruneFailed)))
        .then(() =>
          archive(workingPath, exportPath)
            .catch(throwHumanReadableError(errors.ArchiveFailed)))
        .then(() => exportPath);
    });
};

/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath .netcanvas file path
 *
 * @returns A promise which resolves to the destination path.
 */
export const createNetcanvasImport = filePath =>
  getTempDir('protocols')
    .then((protocolsDir) => {
      const destinationPath = path.join(protocolsDir, uuid());

      return Promise.resolve()
        .then(() =>
          fse.access(filePath, fse.constants.W_OK)
            .catch(throwHumanReadableError(errors.MissingPermissions)),
        )
        .then(() =>
          extract(filePath, destinationPath)
            .catch(throwHumanReadableError(errors.ExtractFailed)))
        .then(() => destinationPath);
    });

const checkExists = filePath =>
  fse.access(filePath, fse.constants.R_OK)
    .then(() => true)
    .catch(() => false);

export const deployNetcanvas = (netcanvasExportPath, destinationUserPath) => {
  const backupPath = `${destinationUserPath}.backup-${new Date().getTime()}`;

  return Promise.resolve()
    .then(() =>
      checkExists()
        .then((exists) => {
          if (!exists) { return false; }
          return fse.rename(destinationUserPath, backupPath)
            .then(() => true);
        })
        .catch(throwHumanReadableError(errors.BackupFailed)),
    )
    .then(createdBackup =>
      fse.rename(netcanvasExportPath, destinationUserPath)
        .then(() => createdBackup)
        .catch(throwHumanReadableError(errors.SaveFailed)),
    )
    .then(createdBackup => ({
      savePath: destinationUserPath,
      backupPath: createdBackup ? backupPath : null,
    }));
};

// TODO: add tests
// TODO: add readable errors
export const createNetcanvas = (destinationUserPath) => {
  const appPath = remote.app.getAppPath();
  const templatePath = path.join(appPath, 'template');

  return getTempDir('new')
    .then((newDir) => {
      const workingPath = path.join(newDir, uuid());

      return fse.copy(templatePath, workingPath)
        .then(() =>
          fse.readJson(path.join(templatePath, 'protocol.json')))
        .then(protocolTemplate => ({ schemaVersion: APP_SCHEMA_VERSION, ...protocolTemplate }))
        .then(protocol => createNetcanvasExport(workingPath, protocol))
        // .then(console.log)
        //   .then((...args) => { throw new Error(...args); })
        .then(netcanvasExportPath =>
          deployNetcanvas(netcanvasExportPath, destinationUserPath),
        );
    });
};

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} protocolPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
export const readProtocol = (protocolPath) => {
  const protocolFile = path.join(protocolPath, 'protocol.json');

  return fse.readJson(protocolFile)
    .catch((e) => {
      switch (e.code) {
        case 'ENOENT':
          return throwHumanReadableError(errors.MissingProtocolJson)(e);
        default:
          return throwHumanReadableError(errors.ProtocolJsonParseError)(e);
      }
    });
};

/**
 * Read a netcanvas file, extract it and try to read protocol.json
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to true if protocol is read successfully
 */
export const verifyNetcanvas = filePath =>
  Promise.resolve()
    .then(() =>
      createNetcanvasImport(filePath)
        .then(readProtocol)
        .catch(throwHumanReadableError(errors.NetcanvasCouldNotValidate)),
    )
    .then(protocol =>
      validateProtocol(protocol)
        .catch(throwHumanReadableError(errors.NetcanvasValidationError)),
    )
    .then(() => filePath);


/**
 * Save the protocol to the target filepath, verify before moving to userspace
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to { savePath, backupPath } if successful
 */
export const netcanvasExport = (workingPath, protocol, filePath) =>
  // export protocol to random temp location
  createNetcanvasExport(workingPath, protocol)
    .then(exportPath =>
      // open and validate the completed export
      verifyNetcanvas(exportPath)
        // rename existing file to backup location, and move export to this location
        // resolves to `{ savePath: [destination i.e. filePath], backupPath: [backup path] }`
        .then(() => deployNetcanvas(exportPath, filePath)),
    );
