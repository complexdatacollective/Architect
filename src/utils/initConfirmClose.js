import React from 'react';
import { ipcRenderer } from 'electron';
import { store } from '../ducks/store';
import { actionCreators as dialogActions } from '../ducks/modules/dialogs';

const initFileOpener = () => {
  ipcRenderer.on('CONFIRM_CLOSE', () => {
    const state = store.getState();
    const hasUnsavedChanges = state.session.lastChanged > state.session.lastSaved;

    if (!hasUnsavedChanges) {
      ipcRenderer.send('QUIT');
      return;
    }

    store.dispatch(
      dialogActions.openDialog({
        type: 'Warning',
        title: 'Unsaved changes',
        message: (
          <div>
            Are you sure you want to exit the application?
            <p><strong>Any unsaved changes will be lost!</strong></p>
          </div>
        ),
        confirmLabel: 'Exit application',
        onConfirm: () => {
          ipcRenderer.send('QUIT');
        },
      }),
    );
  });
};

export default initFileOpener;
