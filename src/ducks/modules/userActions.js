/* eslint-disable import/prefer-default-export */

import * as netcanvasFile from '@app/utils/netcanvasFile';
import { getHasUnsavedChanges } from '@selectors/session';
import { openDialog, saveCopyDialog, saveDialog, createDialogOptions } from '@app/utils/dialogs';
import { UnsavedChanges } from '@components/Dialogs';
import { actionCreators as sessionActions } from '@modules/session';
import { actionCreators as dialogsActions } from '@modules/dialogs';

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
        if (!confirm) { return false; }

        return openDialog()
          .then(({ canceled, filePaths }) => {
            const filePath = filePaths && filePaths[0];
            if (canceled || !filePath) { return false; }

            return dispatch(sessionActions.openNetcanvas(filePath));
          });
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
      .then(({ savePath }) => dispatch(sessionActions.openNetcanvas(savePath)));


export const actionCreators = {
  openNetcanvas,
  createNetcanvas,
  saveAsNetcanvas,
};
