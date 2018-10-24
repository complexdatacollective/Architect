import { ipcRenderer } from 'electron';
import history from './history';
import previewStore from './ducks/previewStore';
import { actionCreators as previewActions } from './ducks/modules/preview';

const initPreview = () => {
  ipcRenderer.on('OPEN_PREVIEW', (event, { protocol, stageIndex }) => {
    console.log('OPEN_PREVIEW', { protocol, stageIndex });
    previewStore.dispatch(previewActions.setProtocol(protocol, stageIndex));
    history.push('/preview');
  });
};

export default initPreview;
