import { ipcRenderer } from 'electron';
import history from './history';
import previewStore from './ducks/previewStore';
import { actionCreators as previewActions } from './ducks/preview/preview';

const initPreview = () => {
  ipcRenderer.on('OPEN_PREVIEW', (event, { protocol, path, stageIndex }) => {
    previewStore.dispatch(previewActions.setProtocol({ protocol, path }));
    history.push(`/preview/${stageIndex}`);
  });
};

export default initPreview;
