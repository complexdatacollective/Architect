import { ipcRenderer } from 'electron';
import { store } from '@app/ducks/store';
import { getActiveProtocol } from '@selectors/session';
import { actionCreators as userActions } from '@modules/userActions';

const initFileOpener = () => {
  ipcRenderer.on('OPEN_FILE', (event, protocolPath) => {
    // eslint-disable-next-line no-console
    console.log(`Open file "${protocolPath}"`);
    const state = store.getState();
    const filePath = getActiveProtocol(state);

    // If the protocol is already open, no op
    if (filePath === protocolPath) {
      // eslint-disable-next-line no-console
      console.log('Already open, do nothing.');
      return;
    }

    store.dispatch(userActions.openNetcanvas(protocolPath));
  });

  ipcRenderer.send('READY');
};

export default initFileOpener;
