import { ipcRenderer } from 'electron';
import { store } from '../ducks/store';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

const initFileOpener = () => {
  ipcRenderer.on('SAVE_COPY', (e, filePath) => {
    store.dispatch(protocolsActions.saveCopy(filePath));
  });
};

export default initFileOpener;
