/* eslint-disable import/prefer-default-export */
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';
import * as netcanvasFile from '@app/utils/netcanvasFile';
import validateProtocol from '@app/utils/validateProtocol';
import getMigrationNotes from '@app/protocol-validation/migrations/getMigrationNotes';
import { getHasUnsavedChanges } from '@selectors/session';
import { getProtocol } from '@selectors/protocol';
import {
  openDialog,
  saveCopyDialog,
  saveDialog,
  createDialogOptions,
} from '@app/utils/dialogs';
import { UnsavedChanges } from '@components/Dialogs';
import { actionCreators as sessionActions } from '@modules/session';
import { actionCreators as dialogsActions } from '@modules/dialogs';
import {
  validationErrorDialog,
  appUpgradeRequiredDialog,
  mayUpgradeProtocolDialog,
} from '@modules/protocols/dialogs';

const { schemaVersionStates } = netcanvasFile;

const dialogCancelledError = new Error('Dialog cancelled');

const validateActiveProtocol = () =>
  (dispatch, getState) => {
    const state = getState();
    const protocol = getProtocol(state);
    return validateProtocol(protocol)
      .catch(e => dispatch(validationErrorDialog(e)));
  };

const checkUnsavedChanges = () =>
  (dispatch, getState) =>
    Promise.resolve(getHasUnsavedChanges(getState()))
      .then((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) { return true; }

        const unsavedChangesDialog = UnsavedChanges({
          confirmLabel: 'Save changes and continue?',
        });

        return dispatch(dialogsActions.openDialog(unsavedChangesDialog))
          .then((confirm) => {
            if (!confirm) { return false; }

            return dispatch(sessionActions.saveNetcanvas())
              .then(() => confirm);
          });
      });


const getNewFileName = filePath =>
  Promise.resolve(path.basename(filePath, '.netcanvas'))
    .then(basename =>
      saveDialog({
        buttonLabel: 'Save',
        nameFieldLabel: 'Save:',
        defaultPath: `${basename} (schema version ${APP_SCHEMA_VERSION}).netcanvas`,
        filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
      }),
    );

const upgradeProtocol = (filePath, protocolSchemaVersion) =>
  (dispatch) => {
    const migrationNotes = getMigrationNotes(protocolSchemaVersion, APP_SCHEMA_VERSION);
    const upgradeDialog = mayUpgradeProtocolDialog(
      protocolSchemaVersion,
      APP_SCHEMA_VERSION,
      migrationNotes,
    );

    return Promise.resolve()
      .then(() => dispatch(upgradeDialog))
      .then((confirm) => {
        if (!confirm) { throw dialogCancelledError; }

        return getNewFileName(filePath);
      })
      .then(({ canceled, filePath: newFilePath }) => {
        if (canceled || !newFilePath) { throw dialogCancelledError; }

        return netcanvasFile.migrateNetcanvas(filePath, newFilePath, APP_SCHEMA_VERSION);
      })
      .then(migratedFilePath => dispatch(sessionActions.openNetcanvas(migratedFilePath)))
      .catch((e) => {
        if (e === dialogCancelledError) { return; }
        throw e;
      });
  };

const openNetcanvas = () =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(checkUnsavedChanges))
      .then((confirm) => {
        if (!confirm) { throw dialogCancelledError; }

        return openDialog();
      })
      .then(({ canceled, filePaths }) => {
        const filePath = filePaths && filePaths[0];
        if (canceled || !filePath) { throw dialogCancelledError; }

        return netcanvasFile.checkSchemaVersion(filePath)
          .then(([protocolSchemaVersion, schemaVersionStatus]) => {
            switch (schemaVersionStatus) {
              case schemaVersionStates.OK:
                return dispatch(sessionActions.openNetcanvas(filePath));
              case schemaVersionStates.UPGRADE_PROTOCOL:
                return dispatch(upgradeProtocol(filePath, protocolSchemaVersion));
              case schemaVersionStates.UPGRADE_APP:
                return dispatch(appUpgradeRequiredDialog(protocolSchemaVersion));
              default:
                return null;
            }
          });
      })
      .catch((e) => {
        if (e === dialogCancelledError) { return; }
        throw e;
      });

const createNetcanvas = () =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(checkUnsavedChanges))
      .then((confirm) => {
        if (!confirm) { return false; }

        return saveDialog(createDialogOptions);
      })
      .then(({ canceled, filePath }) => {
        if (canceled) { return false; }

        return netcanvasFile.createNetcanvas(filePath);
      })
      .then(({ savePath }) => dispatch(sessionActions.openNetcanvas(savePath)));


const saveAsNetcanvas = () =>
  dispatch =>
    saveCopyDialog()
      .then(({ canceled, filePath }) => {
        if (canceled) { return false; }

        return dispatch(sessionActions.saveAsNetcanvas(filePath));
      })
      .then(() => dispatch(validateActiveProtocol()))
      .then(({ savePath }) => dispatch(sessionActions.openNetcanvas(savePath)));

const saveNetcanvas = () =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(validateActiveProtocol()))
      .then(() => dispatch(sessionActions.saveNetcanvas()));


export const actionCreators = {
  openNetcanvas,
  createNetcanvas,
  saveAsNetcanvas,
  saveNetcanvas,
};
