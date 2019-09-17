import { remote } from 'electron';
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';
import hasMigrationPath from '@app/protocol-validation/migrations/hasMigrationPath';
import migrateProtocol from '@app/protocol-validation/migrations/migrateProtocol';
import validateProtocol from '@app/utils/validateProtocol';
import unbundleProtocol from '@app/other/protocols/unbundleProtocol';
import { loadProtocolConfiguration, saveProtocol, bundleProtocol } from '@app/other/protocols';
import { actionCreators as registerActions } from './register';
import { validationErrorDialog, appUpgradeRequiredDialog, mayUpgradeProtocolDialog } from './dialogs';

const IMPORT_PROTOCOL = 'PROTOCOLS/IMPORT';
const IMPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/IMPORT_SUCCESS';
const IMPORT_PROTOCOL_ERROR = 'PROTOCOLS/IMPORT_ERROR';

const importProtocol = filePath => ({
  type: IMPORT_PROTOCOL,
  filePath,
});

const importProtocolSuccess = ({ filePath, workingPath }) => ({
  type: IMPORT_PROTOCOL_SUCCESS,
  filePath,
  workingPath,
});

const importProtocolError = (error, filePath) => ({
  type: IMPORT_PROTOCOL_ERROR,
  filePath,
  error,
});

class NoMigrationPathError extends Error {}

const getNewFileName = filePath =>
  new Promise((resolve, reject) => {
    const basename = path.basename(filePath, '.netcanvas');

    remote.dialog.showSaveDialog(
      {
        buttonLabel: 'Save',
        nameFieldLabel: 'Save:',
        defaultPath: `${basename} (schema version ${APP_SCHEMA_VERSION}).netcanvas`,
        filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
      },
      (filename) => {
        if (filename === undefined) { reject(); return; }
        resolve(filename);
      },
    );
  });

const checkMigrationPath = ({ protocol }) =>
  new Promise((resolve, reject) => {
    if (!hasMigrationPath(protocol, APP_SCHEMA_VERSION)) {
      reject(NoMigrationPathError);
    }

    resolve(true);
  });

const upgradeAppWorkflow = ({ filePath, protocol }) =>
  dispatch =>
    dispatch(appUpgradeRequiredDialog(filePath, protocol));

const versionMatchWorkflow = ({ protocol, filePath, workingPath }) =>
  dispatch =>
    validateProtocol(protocol)
      // We don't actually want to stop the protocol from being
      // imported for a validation error, so this is separate
      // from the loading logic
      .catch((e) => {
        dispatch(validationErrorDialog(e, filePath));
      })
      .then(() => {
        // all was well
        dispatch(importProtocolSuccess({ filePath, workingPath }));
        return dispatch(registerActions.registerProtocol({ filePath, workingPath }));
      });

const migrateWorkflow = ({ protocol, filePath, workingPath }) =>
  dispatch =>
    checkMigrationPath({ protocol, filePath })
      .then(() => dispatch(mayUpgradeProtocolDialog(filePath, protocol)))
      .then((confirm) => {
        if (confirm) {
          return getNewFileName(filePath)
            .then((newFilePath) => {
              const updatedProtocol = migrateProtocol(protocol, APP_SCHEMA_VERSION);

              return saveProtocol(workingPath, updatedProtocol)
                .then(() => bundleProtocol(workingPath, newFilePath))
                .then(() =>
                  dispatch(versionMatchWorkflow({
                    protocol: updatedProtocol,
                    filePath: newFilePath,
                    workingPath,
                  })),
                );
            });
        }
      })
      .catch((err) => {
        if (err instanceof NoMigrationPathError) {
          return dispatch(upgradeAppWorkflow({ filePath, protocol }));
        }

        throw err;
      });

const importProtocolThunk = filePath =>
  (dispatch) => {
    dispatch(importProtocol(filePath));

    return unbundleProtocol(filePath)
      .then(workingPath =>
        loadProtocolConfiguration(workingPath)
          .then((protocol) => {
            // If the schema version is higher than the app, user may need to upgrade the app
            if (protocol.schemaVersion > APP_SCHEMA_VERSION) {
              return dispatch(upgradeAppWorkflow({ filePath }));
            }

            // If the schema is potentially upgradable then try to migrate it
            if (protocol.schemaVersion < APP_SCHEMA_VERSION) {
              return dispatch(migrateWorkflow({ protocol, filePath, workingPath }));
            }

            // If the version matches, then we can open it!
            return dispatch(versionMatchWorkflow({ protocol, filePath, workingPath }));
          }),
      )
      .catch((e) => {
        dispatch(importProtocolError(e, filePath));

        throw e;
      });
  };

const actionCreators = {
  importProtocol: importProtocolThunk,
  importProtocolSuccess,
  importProtocolError,
};

const actionTypes = {
  IMPORT_PROTOCOL,
  IMPORT_PROTOCOL_SUCCESS,
  IMPORT_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

