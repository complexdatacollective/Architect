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
import { pruneProtocol } from '@app/utils/prune';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import protocolTemplate from '@app/utils/protocolTemplate.json';

const errors = {
  NotFound: 'NotFound', // File could not be found
  IncorrectPermissions: 'IncorrectPermissions', // File does not have read/write permissions
  ReadError: 'ReadError', // File could not be read
  WriteError: 'WriteError', // File could not be written
  MigrationFailed: 'MigrationFailed', // Protocol could not be migrated
  CreateFailed: 'CreateFailed', // Netcanvas file could not be generated
  SaveFailed: 'SaveFailed', // Netcanvas file could not be saved
  OpenFailed: 'OpenFailed', // Netcanvas file could not be opened
  VerificationFailed: 'VerificationFailed', // Netcanvas file could not be verifed
};

const schemaVersionStates = {
  UPGRADE_APP: 'UPGRADE_APP',
  UPGRADE_PROTOCOL: 'UPGRADE_PROTOCOL',
  OK: 'OK',
};

const ProtocolsDidNotMatchError = new Error('Protocols did not match');

/**
 * Helper function generator for use with `.catch()`. The original error
 * is logged, and then substituted for the custom error object, which is
 * thrown.
 * @param readableError An error object
 * @returns {function} A function that can be used inside .catch();
 */
const getFriendlyError = (e, friendlyCode) => {
  e.friendlyCode = friendlyCode;
  return e;
};

const handleError = defaultError =>
  (e) => {
    log.error(e);

    switch (e.code) {
      case 'EACCES':
        throw getFriendlyError(e, errors.IncorrectPermissions);
      case 'ENOENT':
        throw getFriendlyError(e, errors.NotFound);
      default:
        throw getFriendlyError(e, defaultError);
    }
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
    .then(prunedProtocol =>
      fse.writeJson(protocolJsonPath, prunedProtocol, { spaces: 2 })
        .catch(handleError(errors.WriteError))
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
const importNetcanvas = filePath =>
  getTempDir('protocols')
    .then((protocolsDir) => {
      const destinationPath = path.join(protocolsDir, uuid());

      return fse.access(filePath, fse.constants.W_OK)
        .then(() => extract(filePath, destinationPath))
        .then(() => destinationPath)
        .catch(handleError(errors.OpenFailed));
    });

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
    .then(createdBackup =>
      fse.rename(netcanvasExportPath, destinationUserPath)
        .then(() => ({
          savePath: destinationUserPath,
          backupPath: createdBackup ? backupPath : null,
        })),
    );
};

const commitNetcanvas = ({ savePath, backupPath }) => {
  if (!backupPath) { return savePath; }
  // Check the new file definitely exists before deleting backup
  return fse.stat(savePath)
    .then((stat) => {
      if (!stat.isFile()) { return null; }
      return fse.unlink(backupPath)
        .then(() => savePath);
    });
};

/**
 * Create a new .netcanvas file at the target location.
 *
 * @param destinationUserPath Destination path
 * @returns {Promise} Resolves to { savePath, backupPath }
 */
const createNetcanvas = destinationUserPath =>
  getTempDir('new')
    .then((newDir) => {
      const workingPath = path.join(newDir, uuid());
      const assetPath = path.join(workingPath, 'assets');

      return fse.mkdirp(assetPath)
        .then(() => ({ schemaVersion: APP_SCHEMA_VERSION, ...protocolTemplate }))
        .then(protocol => createNetcanvasExport(workingPath, protocol))
        .then(netcanvasExportPath =>
          deployNetcanvas(netcanvasExportPath, destinationUserPath),
        );
    })
    .catch(handleError(errors.CreateFailed));

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
  Promise.all([
    pruneProtocol(protocol),
    importNetcanvas(filePath)
      .then(readProtocol),
  ])
    .then(([prunedProtocol, fileProtocol]) => {
      const match = isEqual(
        // fileProtocol, prunedProtocol,
        { ...fileProtocol, lastModified: null },
        { ...prunedProtocol, lastModified: null },
      );

      if (!match) {
        throw ProtocolsDidNotMatchError;
      }

      return true;
    })
    .then(() => filePath)
    .catch(handleError(errors.VerificationFailed));

/**
 * Validate a netcanvas file
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to `filePath`
 */
const validateNetcanvas = filePath =>
  Promise.resolve()
    .then(() => importNetcanvas(filePath))
    .then(readProtocol)
    .then(protocol => validateProtocol(protocol))
    .then(() => filePath);

/**
 * Save the protocol to the target filepath, verify before moving to userspace
 * @param filePath .netcanvas file path
 * @returns {Promise} Resolves to { savePath, backupPath }
 */
const saveNetcanvas = (workingPath, protocol, filePath) =>
  // export protocol to random temp location
  createNetcanvasExport(workingPath, protocol)
    // rename existing file to backup location, and move export to this location
    // resolves to `{ savePath: [destination i.e. filePath], backupPath: [backup path] }`
    .then(exportPath => deployNetcanvas(exportPath, filePath))
    // open and validate the completed export
    .then(({ savePath, backupPath }) =>
      verifyNetcanvas(filePath, protocol)
        .then(() => commitNetcanvas({ savePath, backupPath })),
    )
    .then(() => filePath)
    .catch(handleError(errors.SaveFailed));

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
    .then(({ savePath }) => savePath)
    .catch(handleError(errors.MigrationFailed));

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
