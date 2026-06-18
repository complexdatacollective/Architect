import { store } from '@app/ducks/store';
import { actionCreators as userActions } from '@modules/userActions';
import { getActiveProtocol } from '@selectors/session';
import { electronAPI } from '@utils/electronBridge';

const initFileOpener = () => {
  electronAPI.ipc.on('OPEN_FILE', (_event, protocolPath) => {
    const state = store.getState();
    const filePath = getActiveProtocol(state);

    // If the protocol is already open, no op
    if (filePath === protocolPath) {
      return;
    }

    store.dispatch(userActions.openNetcanvas(protocolPath));
  });

  electronAPI.ipc.send('READY');
};

export default initFileOpener;
