import React from 'react';
import { ipcRenderer } from 'electron';
import { store } from '@app/ducks/store';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionCreators as protocolsActions } from '@modules/protocols';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getHasUnsavedChanges } from '@selectors/session';
import { UnsavedChanges } from '@components/Dialogs';

const initFileOpener = () => {
  ipcRenderer.on('OPEN_FILE', (event, protocolPath) => {
    // eslint-disable-next-line no-console
    console.log(`Open file "${protocolPath}"`);
    const state = store.getState();
    const meta = getActiveProtocolMeta(state);
    const hasUnsavedChanges = getHasUnsavedChanges(state.session.lastChanged);

    // If the protocol is already open, no op
    if (meta && meta.filePath === protocolPath) {
      // eslint-disable-next-line no-console
      console.log('Already open, do nothing.');
      return;
    }

    if (!hasUnsavedChanges) {
      // eslint-disable-next-line no-console
      console.log('No unsaved changes, open.');
      store.dispatch(protocolsActions.unbundleAndLoadProtocol(protocolPath));
      return;
    }

    // eslint-disable-next-line no-console
    console.log('Has unsaved changes, confirm.');

    store.dispatch(dialogActions.openDialog(UnsavedChanges({
      message: (
        <p>
          Attempting to open <em>{protocolPath}</em>,
          but current protocol has unsaved changes.
        </p>
      ),
      confirmLabel: 'Save changes and continue',
    })))
      .then((confirm) => {
        if (!confirm) { return Promise.resolve(); }
        return store.dispatch(protocolsActions.saveAndBundleProtocol())
          .then(() => store.dispatch(protocolsActions.unbundleAndLoadProtocol(protocolPath)));
      });
  });

  ipcRenderer.send('READY');
};

export default initFileOpener;
