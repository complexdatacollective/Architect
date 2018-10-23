import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import previewStore from '../../ducks/previewStore';
import history from '../../history';
import Preview from './Preview';

const PreviewContainer = ({ stageIndex }) => (
  <Provider store={previewStore}>
    <Preview stageIndex={stageIndex} />
  </Provider>
);

export default PreviewContainer;

// TODO: Move this elsewhere?
ipcRenderer.on('OPEN_PREVIEW', (event, protocolId, stageIndex) => {
  // console.log(`Open preview: /preview/${protocolId}/${stageIndex}`);
  console.log('Open preview', protocolId, stageIndex);

  history.push(`/preview/${protocolId}/${stageIndex}`);
});
