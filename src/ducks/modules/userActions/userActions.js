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
  fileErrorHandler,
} from '@modules/userActions/dialogs';
import { createLock } from '@modules/ui/status';

const protocolsLock = createLock('PROTOCOLS');
const loadingLock = createLock('PROTOCOLS/LOADING');
const savingLock = createLock('PROTOCOLS/SAVING');

const { schemaVersionStates } = netcanvasFile;

const dialogCancelledError = new Error('Dialog cancelled');

const catchDialogCancel = (e) => {
  if (e === dialogCancelledError) { return; }
  throw e;
};

const sessionOpenWithValidationCheck = filePath =>
  dispatch =>
    Promise.resolve()
      .then(() => netcanvasFile.validateNetcanvas(filePath))
      .catch(e => dispatch(validationErrorDialog(e)))
      .then(() => sessionActions.openNetcanvas(filePath))
      .catch(e => dispatch(fileErrorHandler(e)));

const checkUnsavedChanges = () =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(() => getHasUnsavedChanges(getState()))
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
      .catch(catchDialogCancel)
      .then(migratedFilePath => dispatch(sessionOpenWithValidationCheck(migratedFilePath)));
  };

const openNetcanvas = netcanvasFilePath =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(checkUnsavedChanges()))
      .then((confirm) => {
        if (!confirm) { throw dialogCancelledError; }

        if (!netcanvasFilePath) {
          return openDialog();
        }

        return { cancelled: null, filePaths: [netcanvasFilePath] };
      })
      .then(({ canceled, filePaths }) => {
        const filePath = filePaths && filePaths[0];
        if (canceled || !filePath) { throw dialogCancelledError; }

        return netcanvasFile.checkSchemaVersion(filePath)
          .then(([protocolSchemaVersion, schemaVersionStatus]) => {
            switch (schemaVersionStatus) {
              case schemaVersionStates.OK:
                return dispatch(sessionOpenWithValidationCheck(filePath));
              case schemaVersionStates.UPGRADE_PROTOCOL:
                return dispatch(upgradeProtocol(filePath, protocolSchemaVersion));
              case schemaVersionStates.UPGRADE_APP:
                return dispatch(appUpgradeRequiredDialog(protocolSchemaVersion));
              default:
                return null;
            }
          });
      })
      .catch(catchDialogCancel);

const createNetcanvas = () =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(checkUnsavedChanges))
      .then((confirm) => {
        if (!confirm) { throw dialogCancelledError; }

        return saveDialog(createDialogOptions);
      })
      .then(({ canceled, filePath }) => {
        if (canceled) { throw dialogCancelledError; }

        return netcanvasFile.createNetcanvas(filePath);
      })
      .catch(catchDialogCancel)
      .then(({ savePath }) => dispatch(sessionOpenWithValidationCheck(savePath)))
      .catch(e => dispatch(fileErrorHandler(e)));

const saveAsNetcanvas = () =>
  dispatch =>
    saveCopyDialog()
      .then(({ canceled, filePath }) => {
        if (canceled) { throw dialogCancelledError; }

        return dispatch(sessionActions.saveAsNetcanvas(filePath));
      })
      .catch(catchDialogCancel)
      .then(({ savePath }) => dispatch(sessionOpenWithValidationCheck(savePath)))
      .catch(e => dispatch(fileErrorHandler(e)));

const saveNetcanvas = () =>
  (dispatch, getState) => {
    const state = getState();
    const protocol = getProtocol(state);

    return validateProtocol(protocol)
      .catch(e => dispatch(validationErrorDialog(e)))
      .then(() => dispatch(sessionActions.saveNetcanvas()))
      .catch(e => dispatch(fileErrorHandler(e)));
  };

export const actionLocks = {
  loading: loadingLock,
  protocols: protocolsLock,
  saving: savingLock,
};

export const actionCreators = {
  openNetcanvas,
  createNetcanvas,
  saveAsNetcanvas,
  saveNetcanvas,
};
