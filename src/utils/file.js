import { remote } from 'electron';
import fse from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import uuid from 'uuid';
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

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object.
 */
export const createNetcanvasExport = (workingPath, protocol) => {
  const exportPath = path.join(remote.app.getPath('temp'), 'architect', 'exports', uuid());
  const protocolJsonPath = path.join(workingPath, 'protocol.json');
  log.info(`Save protocol object to ${protocolJsonPath}`);

  return Promise.resolve(protocol)
    .then(data =>
      getStringifiedProtocol(data)
        .then(protocolData => fse.writeFile(protocolJsonPath, protocolData))
        .catch(throwHumanReadableError(errors.SaveFailed)),
    )
    .then(() =>
      pruneAssets(workingPath)
        .catch(throwHumanReadableError(errors.PruneFailed)))
    .then(() =>
      archive(workingPath, exportPath)
        .catch(throwHumanReadableError(errors.ArchiveFailed)))
    .then(() => exportPath);
};

/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath .netcanvas file path
 *
 * @returns A promise which resolves to the destination path.
 */
export const createNetcanvasImport = (filePath) => {
  const destinationPath = path.join(remote.app.getPath('temp'), 'architect', 'protocols', uuid());

  return Promise.resolve()
    .then(() =>
      fse.access(filePath, fse.constants.W_OK)
        .catch(throwHumanReadableError(errors.MissingPermissions)),
    )
    .then(() =>
      extract(filePath, destinationPath)
        .catch(throwHumanReadableError(errors.ExtractFailed)))
    .then(() => destinationPath);
};

export const deployNetcanvasExport = (netcanvasExportPath, destinationUserPath) => {
  const backupPath = `${destinationUserPath}.backup-${new Date().getTime()}`;
  return Promise.resolve()
    .then(() =>
      fse.rename(destinationUserPath, backupPath)
        .catch(throwHumanReadableError(errors.BackupFailed)),
    )
    .then(() =>
      fse.rename(netcanvasExportPath, destinationUserPath)
        .then(() => new Error('should throw'))
        .catch(throwHumanReadableError(errors.SaveFailed)),
    )
    .then(() => ({ savePath: destinationUserPath, backupPath }));
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
    .then(() => true);
