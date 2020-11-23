import { remote } from 'electron';
import fse from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import uuid from 'uuid';
import { isEqual } from 'lodash';
import { APP_SCHEMA_VERSION } from '@app/config';
import canUpgrade from '@app/protocol-validation/migrations/canUpgrade';
import migrateProtocol from '@app/protocol-validation/migrations/migrateProtocol';
import validateProtocol from '@app/utils/validateProtocol';
import pruneProtocol from '@app/utils/pruneProtocol';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';

const errors = {
  CreateTemplateFailed: new Error('New protocol template could not be created'),
  MissingSchemaVersion: new Error('Schema version not defined in protocol'),
  MissingPermissions: new Error('Protocol does not have read/write permissions'),
  ExtractFailed: new Error('Protocol could not be extracted'),
  BackupFailed: new Error('Protocol could not be backed up'),
  SaveFailed: new Error('Protocol could not be saved to destination'),
  ArchiveFailed: new Error('Protocol could not be archived'),
  MissingProtocolJson: new Error('Protocol does not have a json file'),
  ProtocolJsonParseError: new Error('Protocol json could not be parsed'),
  NetcanvasCouldNotBeOpened: new Error('Netcanvas file could not be opened'),
  NetcanvasVerificationError: new Error('Netcanvas file could not be verifed'),
};

const schemaVersionStates = {
  UPGRADE_APP: 'UPGRADE_APP',
  UPGRADE_PROTOCOL: 'UPGRADE_PROTOCOL',
  OK: 'OK',
};

/**
 * Helper function generator for use with `.catch()`. The original error
 * is logged, and then substituted for the custom error object, which is
 * thrown.
 * @param readableError An error object
 * @returns {function} A function that can be used inside .catch();
 */
const throwHumanReadableError = readableError =>
  (e) => {
    log.error(e);
    throw readableError;
  };

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
 * Check that a given file has read access (R_OK)
 * @param {string} filePath
 * @returns {Promise} Resolves to true if file is readable or false otherwise
 */
const checkExists = filePath =>
  fse.access(filePath, fse.constants.R_OK)
    .then(() => true)
    .catch(() => false);

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} workingPath The protocol directory.
 * @returns {object} The protocol as an object
 */
const readProtocol = (workingPath) => {
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

  return Promise.resolve()
    .then(() => pruneProtocol(protocol))
    .then(prunedProtocol =>
      fse.writeJson(protocolJsonPath, prunedProtocol, { spaces: 2 })
        .then(() => pruneProtocolAssets(workingPath))
        .then(() => prunedProtocol),
    );
};

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object (optional)
 * @returns {Promise} Resolves to a path in temp (random)
 */
const createNetcanvasExport = (workingPath, protocol) => {
  if (!protocol) { return Promise.reject(); }

  return writeProtocol(workingPath, protocol)
    .catch(throwHumanReadableError(errors.SaveFailed))
    .then(() => getTempDir('exports'))
    .then((exportDir) => {
      const exportPath = path.join(exportDir, uuid());

      return archive(workingPath, exportPath)
        .catch(throwHumanReadableError(errors.ArchiveFailed))
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
const importNetcanvas = filePath =>
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

/**
 * Move a netcanvas file located in temporary directory into user space.
 * If the destination exists, make a backup copy of that file.
 *
 * @param netcanvasExportPath .netcanvas file path in temp
 * @param destinationUserPath Destination path
 * @returns {Promise} Resolves to { savePath, backupPath } if successful
 */
const deployNetcanvas = (netcanvasExportPath, destinationUserPath, createBackup = true) => {
  const backupPath = `${destinationUserPath}.backup-${new Date().getTime()}`;

  return Promise.resolve()
    .then(() => {
      if (!createBackup) { return false; }

      return checkExists()
        .then((exists) => {
          if (!exists) { return false; }
          return fse.rename(destinationUserPath, backupPath)
            .then(() => true);
        })
        .catch(throwHumanReadableError(errors.BackupFailed));
    })
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

/**
 * Create a new .netcanvas file at the target location.
 *
 * @param destinationUserPath Destination path
 * @returns {Promise} Resolves to { savePath, backupPath }
 */
// TODO: add tests
// TODO: add readable errors
const createNetcanvas = (destinationUserPath) => {
  const appPath = remote.app.getAppPath();
  const templatePath = path.join(appPath, 'template');

  return getTempDir('new')
    .then((newDir) => {
      const workingPath = path.join(newDir, uuid());

      return fse.copy(templatePath, workingPath)
        .then(() => fse.readJson(path.join(templatePath, 'protocol.json')))
        .then(protocolTemplate => ({ schemaVersion: APP_SCHEMA_VERSION, ...protocolTemplate }))
        .catch(throwHumanReadableError(errors.CreateTemplateFailed))
        .then(protocol => createNetcanvasExport(workingPath, protocol))
        .then(netcanvasExportPath =>
          deployNetcanvas(netcanvasExportPath, destinationUserPath),
        );
    });
};

/**
 * Asseses a .netcanvas file schema version against the app schema version (or
 * optional specified version). Returns a status code from `schemaVersionStates`.
 *
 * @param filePath .netcanvas file path
 * @param referenceVersion (optional) schema version for comparison
 * @returns {Promise} Resolves to a `schemaVersionStatus`
 */
const checkSchemaVersion = (filePath, referenceVersion = APP_SCHEMA_VERSION) =>
  importNetcanvas(filePath)
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
 * @returns {Promise} Resolves to `filePath`
 */
const verifyNetcanvas = (filePath, protocol) =>
  Promise.resolve()
    .then(() =>
      importNetcanvas(filePath)
        .then(readProtocol)
        .catch(throwHumanReadableError(errors.NetcanvasCouldNotBeOpened)),
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
 * Validate a netcanvas file
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to `filePath`
 */
const validateNetcanvas = filePath =>
  Promise.resolve()
    .then(() =>
      importNetcanvas(filePath)
        .then(readProtocol)
        .catch(throwHumanReadableError(errors.NetcanvasCouldNotBeOpened)),
    )
    .then(protocol => validateProtocol(protocol))
    .then(() => filePath);

/**
 * Save the protocol to the target filepath, verify before moving to userspace
 * @param filePath .netcanvas file path
 * @returns {Promise} Resolves to { savePath, backupPath }
 */
const saveNetcanvas = (workingPath, protocol, filePath, createBackup = true) =>
  // export protocol to random temp location
  createNetcanvasExport(workingPath, protocol)
    .then(exportPath =>
      // open and validate the completed export
      verifyNetcanvas(exportPath, protocol)
        // rename existing file to backup location, and move export to this location
        // resolves to `{ savePath: [destination i.e. filePath], backupPath: [backup path] }`
        .then(() => deployNetcanvas(exportPath, filePath, createBackup)),
    );

/**
 * Upgrades a .netcanvas file to the app schema version (or optional specified version).
 * Creates a new file for the updated .netcanvas
 *
 * @param filePath .netcanvas file path
 * @param newFilePath destination file path
 * @param targetVersion (optional) target version to migrate to
 * @returns {Promise} Resolves to `newFilePath`
 */
const migrateNetcanvas = (filePath, newFilePath, targetVersion = APP_SCHEMA_VERSION) =>
  importNetcanvas(filePath)
    .then(workingPath =>
      readProtocol(workingPath)
        .then(protocol => migrateProtocol(protocol, targetVersion))
        .then(([updatedProtocol, migrationSteps]) => {
          log.info('Migrated protocol', { migrationSteps, updatedProtocol });
          return saveNetcanvas(workingPath, updatedProtocol, newFilePath);
        }),
    )
    .then(({ savePath }) => savePath);

export {
  errors,
  schemaVersionStates,
  writeProtocol,
  readProtocol,
  createNetcanvas,
  createNetcanvasExport,
  importNetcanvas,
  deployNetcanvas,
  checkSchemaVersion,
  verifyNetcanvas,
  saveNetcanvas,
  migrateNetcanvas,
  validateNetcanvas,
};
