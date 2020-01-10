import React from 'react';
import { ipcRenderer } from 'electron';
import { find } from 'lodash';
import { store } from '@app/ducks/store';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionCreators as protocolsActions } from '@modules/protocols';

const initFileOpener = () => {
  ipcRenderer.on('OPEN_FILE', (event, protocolPath) => {
    // eslint-disable-next-line no-console
    console.log(`Open file "${protocolPath}"`);
    const state = store.getState();
    const activeProtocolId = state.session.activeProtocol;
    const meta = find(state.protocols, ['id', activeProtocolId]);
    const hasUnsavedChanges = state.session.lastChanged > state.session.lastSaved;

    // If the protocol is already open, no op
    if (meta && meta.filePath === protocolPath) {
      // eslint-disable-next-line no-console
      console.log('Already open, do nothing.');
      return;
    }

    if (hasUnsavedChanges) {
      // eslint-disable-next-line no-console
      console.log('Has unsaved changes, confirm.');

      store.dispatch(
        dialogActions.openDialog({
          type: 'Warning',
          title: 'Unsaved changes',
          message: (
            <p>
              Attempting to open <em>{protocolPath}</em>,
              but current protocol has unsaved changes.
            </p>
          ),
          confirmLabel: 'Save changes and open?',
          onConfirm: () => {
            store.dispatch(protocolsActions.saveAndBundleProtocol())
              .then(() => store.dispatch(protocolsActions.unbundleAndLoadProtocol(protocolPath)));
          },
        }),
      );

      return;
    }

    // eslint-disable-next-line no-console
    console.log('No unsaved changes, open.');
    store.dispatch(protocolsActions.unbundleAndLoadProtocol(protocolPath));
  });

  ipcRenderer.send('READY');
};

export default initFileOpener;
