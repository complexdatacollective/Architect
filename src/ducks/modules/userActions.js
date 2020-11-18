/* eslint-disable import/prefer-default-export */

import * as netcanvasFile from '@app/utils/netcanvasFile';
import validateProtocol from '@app/utils/validateProtocol';
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
        if (canceled || !filePath) { throw dialogCancelledError ; }

        return netcanvasFile.checkSchemaVersion(filePath);
      })
      .then(([protocolSchemaVersion, schemaVersionStatus]) => {
        switch (schemaVersionStatus) {
          case schemaVersionStates.OK:
            return dispatch(sessionActions.openNetcanvas(filePath));
          case schemaVersionStates.UPGRADE_PROTOCOL:
            return null;
            // return migrateProtocolThunk({ protocol, filePath, workingPath })
            // get the notes,
            // confirm the migration
            // get a new file path
            // migrate protocol
            // open it
          case schemaVersionStates.UPGRADE_APP:
            return dispatch(appUpgradeRequiredDialog(protocolSchemaVersion));
          default:
            return null;
        }
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
