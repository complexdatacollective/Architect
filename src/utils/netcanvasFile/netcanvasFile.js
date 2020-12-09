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
import { extract } from '@app/utils/protocols/lib/archive';
import protocolTemplate from '@app/utils/protocolTemplate.json';
import {
  errors,
  handleError,
} from './errors';
import {
  commitNetcanvas,
  createNetcanvasExport,
  deployNetcanvas,
  getTempDir,
  readProtocol,
  revertNetcanvas,
} from './lib';

const schemaVersionStates = {
  UPGRADE_APP: 'UPGRADE_APP',
  UPGRADE_PROTOCOL: 'UPGRADE_PROTOCOL',
  OK: 'OK',
};

const ProtocolsDidNotMatchError = new Error('Protocols did not match');

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
      console.log({ prunedProtocol, fileProtocol });

      const match = isEqual(
        { ...fileProtocol, lastModified: null },
        { ...prunedProtocol, lastModified: null },
      );

      if (!match) {
        throw ProtocolsDidNotMatchError;
      }
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
        .then(() => commitNetcanvas({ savePath, backupPath }))
        .catch(e =>
          revertNetcanvas({ savePath, backupPath })
            .then(() => { throw e; }),
        ),
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
    .catch(handleError(errors.MigrationFailed));

// `utils` for functions that aren't expected to be used outside of module

const utils = {
  createNetcanvasExport,
  verifyNetcanvas,
};

export {
  checkSchemaVersion,
  createNetcanvas,
  verifyNetcanvas,
  importNetcanvas,
  migrateNetcanvas,
  saveNetcanvas,
  schemaVersionStates,
  validateNetcanvas,
  utils,
};
