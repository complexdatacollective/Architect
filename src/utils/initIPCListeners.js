import React from 'react';
import { ipcRenderer } from 'electron';
import { isDirty } from 'redux-form';
import { store } from '@app/ducks/store';
import { actionCreators as protocolsActions } from '@modules/protocols';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { formName } from '@components/StageEditor/StageEditor';

const initIPCListeners = () => {
  ipcRenderer.on('SAVE_COPY', () => {
    store.dispatch(protocolsActions.saveCopy());
  });

  ipcRenderer.on('OPEN', () => {
    store.dispatch(protocolsActions.openProtocol());
  });

  ipcRenderer.on('SAVE', () => {
    store.dispatch(protocolsActions.saveAndBundleProtocol());
  });

  ipcRenderer.on('CONFIRM_CLOSE', () => {
    const state = store.getState();
    const hasUnsavedChanges = state.session.lastChanged > state.session.lastSaved;
    const hasDraftChanges = isDirty(formName)(state);

    ipcRenderer.send('CONFIRM_CLOSE_ACK');

    if (!hasUnsavedChanges && !hasDraftChanges) {
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

export default initIPCListeners;
