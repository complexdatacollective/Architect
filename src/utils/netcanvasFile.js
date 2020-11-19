import { remote } from 'electron';
import fse from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import uuid from 'uuid';
import { isEqual } from 'lodash';
import { APP_SCHEMA_VERSION } from '@app/config';
import canUpgrade from '@app/protocol-validation/migrations/canUpgrade';
import migrateProtocol from '@app/protocol-validation/migrations/migrateProtocol';
import pruneProtocol from '@app/utils/pruneProtocol';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';

export const errors = {
  MissingSchemaVersion: new Error('Schema version not defined in protocol'),
  MissingPermissions: new Error('Protocol does not have read/write permissions'),
  ExtractFailed: new Error('Protocol could not be extracted'),
  BackupFailed: new Error('Protocol could not be backed up'),
  SaveFailed: new Error('Protocol could not be saved to destination'),
  PreflightFailed: new Error('Protocol preflight checks failed'),
  ArchiveFailed: new Error('Protocol could not be archived'),
  MissingProtocolJson: new Error('Protocol does not have a json file'),
  ProtocolJsonParseError: new Error('Protocol json could not be parsed'),
  NetcanvasCouldNotValidate: new Error('Netcanvas file could not be validated'),
  NetcanvasVerificationError: new Error('Netcanvas file could not be verifed'),
};

export const schemaVersionStates = {
  UPGRADE_APP: 'UPGRADE_APP',
  UPGRADE_PROTOCOL: 'UPGRADE_PROTOCOL',
  OK: 'OK',
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
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} workingPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
export const readProtocol = (workingPath) => {
  const protocolJsonPath = path.join(workingPath, 'protocol.json');

  return fse.readJson(protocolJsonPath)
    .catch((e) => {
      switch (e.code) {
        case 'ENOENT':
          return throwHumanReadableError(errors.MissingProtocolJson)(e);
        default:
          return throwHumanReadableError(errors.ProtocolJsonParseError)(e);
      }
    });
};

const writeProtocol = (workingPath, protocol) => {
  const protocolJsonPath = path.join(workingPath, 'protocol.json');

  return getStringifiedProtocol(protocol)
    .then(protocolData => fse.writeFile(protocolJsonPath, protocolData));
};

const preflight = workingPath =>
  pruneProtocolAssets(workingPath)
    .then(() => readProtocol(workingPath))
    .then(pruneProtocol)
    .then(prunedProtocol => writeProtocol(workingPath, prunedProtocol));

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object (optional)
 */
export const createNetcanvasExport = (workingPath, protocol) => {
  if (!protocol) { return Promise.reject(); }

  return getTempDir('exports')
    .then((exportDir) => {
      const exportPath = path.join(exportDir, uuid());
      return Promise.resolve()
        .then(() =>
          writeProtocol(workingPath, protocol)
            .catch(throwHumanReadableError(errors.SaveFailed)),
        )
        .then(() =>
          preflight(workingPath)
            .catch(throwHumanReadableError(errors.PreflightFailed)),
        )
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
        .then(netcanvasExportPath =>
          deployNetcanvas(netcanvasExportPath, destinationUserPath),
        );
    });
};

export const checkSchemaVersion = (filePath, referenceVersion = APP_SCHEMA_VERSION) =>
  createNetcanvasImport(filePath)
    .then(readProtocol)
    .then((protocol) => {
      if (!protocol.schemaVersion) {
        throw errors.MissingSchemaVersion;
      }

      // If the version matches, then we can open it!
      if (referenceVersion === protocol.schemaVersion) {
        return [protocol.schemaVersion, schemaVersionStates.OK];
      }

      // If the schema is potentially upgradable then try to migrate it
      if (canUpgrade(protocol.schemaVersion, referenceVersion)) {
        return [protocol.schemaVersion, schemaVersionStates.UPGRADE_PROTOCOL];
      }

      // If the schema version is higher than the app, or
      // we can't find an upgrade path user may need to upgrade the app
      return [protocol.schemaVersion, schemaVersionStates.UPGRADE_APP];
    });

/**
 * Verify that a netcanvas file matches a protocol object
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to true if protocol is read successfully
 */
export const verifyNetcanvas = (filePath, protocol) =>
  Promise.resolve()
    .then(() =>
      createNetcanvasImport(filePath)
        .then(readProtocol)
        .catch(throwHumanReadableError(errors.NetcanvasCouldNotValidate)),
    )
    .then((fileProtocol) => {
      const match = isEqual(fileProtocol, protocol);

      if (!match) {
        return throwHumanReadableError(errors.NetcanvasVerificationError)();
      }

      return true;
    })
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
      verifyNetcanvas(exportPath, protocol)
        // rename existing file to backup location, and move export to this location
        // resolves to `{ savePath: [destination i.e. filePath], backupPath: [backup path] }`
        .then(() => deployNetcanvas(exportPath, filePath)),
    );


export const migrateNetcanvas = (filePath, newFilePath, targetVersion = APP_SCHEMA_VERSION) =>
  createNetcanvasImport(filePath)
    .then(workingPath =>
      readProtocol(workingPath)
        .then(protocol => migrateProtocol(protocol, targetVersion))
        .then(([updatedProtocol, migrationSteps]) => {
          log.info('Migrated protocol', { migrationSteps, updatedProtocol });
          return netcanvasExport(workingPath, updatedProtocol, newFilePath);
        }),
    )
    .then(({ savePath }) => savePath);
