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
  netcanvasFileErrorHandler,
} from '@modules/userActions/dialogs';
import { createLock } from '@modules/ui/status';

const protocolsLock = createLock('PROTOCOLS');
const loadingLock = createLock('PROTOCOLS/LOADING');
const savingLock = createLock('PROTOCOLS/SAVING');

const { schemaVersionStates } = netcanvasFile;

const validateAndOpenNetcanvas = filePath =>
  dispatch =>
    Promise.resolve()
      .then(() => netcanvasFile.validateNetcanvas(filePath))
      .catch(e => dispatch(validationErrorDialog(e)))
      .then(() => dispatch(sessionActions.openNetcanvas(filePath)));

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
        if (!confirm) { return null; }

        return getNewFileName(filePath)
          .then(({ canceled, filePath: newFilePath }) => {
            if (canceled || !newFilePath) { return null; }

            return netcanvasFile.migrateNetcanvas(filePath, newFilePath, APP_SCHEMA_VERSION)
              .then(migratedFilePath => dispatch(validateAndOpenNetcanvas(migratedFilePath)));
          });
      });
  };

const openNetcanvas = netcanvasFilePath =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(checkUnsavedChanges()))
      .then((proceed) => {
        if (!proceed) { return { canceled: true }; }

        if (netcanvasFilePath) {
          return { canceled: null, filePaths: [netcanvasFilePath] };
        }

        return openDialog();
      })
      .then(({ canceled, filePaths }) => {
        const filePath = filePaths && filePaths[0];
        if (canceled || !filePath) { return null; }

        return netcanvasFile.checkSchemaVersion(filePath)
          .then(([protocolSchemaVersion, schemaVersionStatus]) => {
            switch (schemaVersionStatus) {
              case schemaVersionStates.OK:
                return dispatch(validateAndOpenNetcanvas(filePath));
              case schemaVersionStates.UPGRADE_PROTOCOL:
                return dispatch(upgradeProtocol(filePath, protocolSchemaVersion));
              case schemaVersionStates.UPGRADE_APP:
                return dispatch(appUpgradeRequiredDialog(protocolSchemaVersion));
              default:
                return null;
            }
          });
      })
      .catch(e => dispatch(netcanvasFileErrorHandler(e, { filePath: netcanvasFilePath })));

const createNetcanvas = () =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch(checkUnsavedChanges))
      .then((confirm) => {
        if (!confirm) { return null; }

        return saveDialog(createDialogOptions)
          .then(({ canceled, filePath }) => {
            if (canceled) { return null; }

            return netcanvasFile.createNetcanvas(filePath)
              .then(({ savePath }) => dispatch(validateAndOpenNetcanvas(savePath)))
              .catch(e => dispatch(netcanvasFileErrorHandler(e, { filePath })));
          });
      })
      .catch(e => dispatch(netcanvasFileErrorHandler(e)));

const saveAsNetcanvas = () =>
  dispatch =>
    saveCopyDialog()
      .then(({ canceled, filePath }) => {
        if (canceled) { return false; }

        return dispatch(sessionActions.saveAsNetcanvas(filePath))
          .then(({ savePath }) => dispatch(validateAndOpenNetcanvas(savePath)))
          .catch(e => dispatch(netcanvasFileErrorHandler(e, { filePath })));
      })
      .catch(e => dispatch(netcanvasFileErrorHandler(e)));

const saveNetcanvas = () =>
  (dispatch, getState) => {
    const state = getState();
    const protocol = getProtocol(state);
    const filePath = state.session.filePath;

    return validateProtocol(protocol)
      .catch(e => dispatch(validationErrorDialog(e)))
      .then(() => dispatch(sessionActions.saveNetcanvas()))
      .catch(e => dispatch(netcanvasFileErrorHandler(e, { filePath })));
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
