import React from 'react';
import { ipcRenderer } from 'electron';
import { isDirty } from 'redux-form';
import { store } from '@app/ducks/store';
import { getHasUnsavedChanges } from '@selectors/session';
import { actionCreators as userActions } from '@modules/userActions';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { formName } from '@components/StageEditor/StageEditor';
import { UnsavedChanges } from '@components/Dialogs';

const initIPCListeners = () => {
  ipcRenderer.on('SAVE_COPY', () => {
    store.dispatch(userActions.saveAsNetcanvas());
  });

  ipcRenderer.on('OPEN', () => {
    store.dispatch(userActions.openNetcanvas());
  });

  ipcRenderer.on('SAVE', () => {
    store.dispatch(userActions.saveNetcanvas());
  });

  ipcRenderer.on('CONFIRM_CLOSE', () => {
    const state = store.getState();
    const hasUnsavedChanges = getHasUnsavedChanges(state);
    const hasDraftChanges = isDirty(formName)(state);

    ipcRenderer.send('CONFIRM_CLOSE_ACK');

    if (!hasUnsavedChanges && !hasDraftChanges) {
      ipcRenderer.send('QUIT');
      return;
    }

    store.dispatch(dialogActions.openDialog(UnsavedChanges({
      message: (
        <div>
          Are you sure you want to exit the application?
          <p><strong>The current protocol has unsaved changes!</strong></p>
        </div>
      ),
      confirmLabel: 'Exit application',
    })))
      .then((confirm) => {
        if (confirm) { ipcRenderer.send('QUIT'); }
      });
  });
};

export default initIPCListeners;
