import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import window from '../../ui/components/window';
import Stage from './Stage';
import store from './store';
import history from '../../history';

const Preview = ({ stageIndex }) => (
  <Provider store={store}>
    <div className="network-canvas">
      <div className="protocol">
        <div className="protocol__content">
          <Stage stageIndex={stageIndex} />
        </div>
      </div>
    </div>
  </Provider>
);

Preview.defaultProps = {
  stageIndex: 0,
};

ipcRenderer.on('OPEN_PREVIEW', (protocolId) => {
  console.log(`Open preview: /preview/${protocolId}`);
  history.push(`/preview/${protocolId}`);
});

export default window(Preview);
