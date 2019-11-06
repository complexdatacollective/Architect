import { remote } from 'electron';
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';
import canUpgrade from '@app/protocol-validation/migrations/canUpgrade';
import migrateProtocol from '@app/protocol-validation/migrations/migrateProtocol';
import validateProtocol from '@app/utils/validateProtocol';
import unbundleProtocol from '@app/other/protocols/unbundleProtocol';
import bundleProtocol from '@app/other/protocols/bundleProtocol';
import saveProtocol from '@app/other/protocols/saveProtocol';
import { loadProtocolConfiguration } from '@app/other/protocols';
import { actionCreators as registerActions } from './register';
import { validationErrorDialog, appUpgradeRequiredDialog, mayUpgradeProtocolDialog } from './dialogs';

const UNBUNDLE_PROTOCOL = 'PROTOCOLS/UNBUNDLE';
const UNBUNDLE_PROTOCOL_SUCCESS = 'PROTOCOLS/UNBUNDLE_SUCCESS';
const UNBUNDLE_PROTOCOL_ERROR = 'PROTOCOLS/UNBUNDLE_ERROR';

const unbundleProtocolAction = filePath => ({
  type: UNBUNDLE_PROTOCOL,
  filePath,
});

const unbundleProtocolSuccess = ({ filePath, workingPath }) => ({
  type: UNBUNDLE_PROTOCOL_SUCCESS,
  filePath,
  workingPath,
});

const unbundleProtocolError = (error, filePath) => ({
  type: UNBUNDLE_PROTOCOL_ERROR,
  filePath,
  error,
});

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

const upgradeAppThunk = ({ protocol }) =>
  dispatch =>
    dispatch(appUpgradeRequiredDialog(protocol));

const registerProtocolThunk = ({ protocol, filePath, workingPath }) =>
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
        dispatch(unbundleProtocolSuccess({ filePath, workingPath }));
        return dispatch(registerActions.registerProtocol({ filePath, workingPath }));
      });

const migrateProtocolThunk = ({ protocol, filePath, workingPath }) =>
  dispatch =>
    dispatch(mayUpgradeProtocolDialog(protocol.schemaVersion, APP_SCHEMA_VERSION))
      .then((confirm) => {
        if (!confirm) { return Promise.reject(); }

        return getNewFileName(filePath)
          .then((newFilePath) => {
            const updatedProtocol = migrateProtocol(protocol, APP_SCHEMA_VERSION);

            return saveProtocol(workingPath, updatedProtocol)
              .then(() => bundleProtocol(workingPath, newFilePath))
              .then(() =>
                dispatch(registerProtocolThunk({
                  protocol: updatedProtocol,
                  filePath: newFilePath,
                  workingPath,
                })),
              );
          });
      });

const unbundleProtocolThunk = filePath =>
  (dispatch) => {
    dispatch(unbundleProtocolAction(filePath));

    return unbundleProtocol(filePath)
      .then(workingPath =>
        loadProtocolConfiguration(workingPath)
          .then((protocol) => {
            if (!protocol.schemaVersion) {
              throw new Error('Schema version not defined in protocol');
            }

            // If the version matches, then we can open it!
            if (APP_SCHEMA_VERSION === protocol.schemaVersion) {
              return dispatch(registerProtocolThunk({ protocol, filePath, workingPath }));
            }

            // If the schema is potentially upgradable then try to migrate it
            if (canUpgrade(protocol.schemaVersion, APP_SCHEMA_VERSION)) {
              return dispatch(migrateProtocolThunk({ protocol, filePath, workingPath }));
            }

            // If the schema version is higher than the app, or
            // we can't find an upgrade path user may need to upgrade the app
            return dispatch(upgradeAppThunk({ protocol }));
          }),
      )
      .catch((e) => {
        dispatch(unbundleProtocolError(e, filePath));

        throw e;
      });
  };

const actionCreators = {
  unbundleProtocol: unbundleProtocolThunk,
  unbundleProtocolSuccess,
  unbundleProtocolError,
};

const actionTypes = {
  UNBUNDLE_PROTOCOL,
  UNBUNDLE_PROTOCOL_SUCCESS,
  UNBUNDLE_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

