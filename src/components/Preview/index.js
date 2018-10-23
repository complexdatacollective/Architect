import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import previewStore from '../../ducks/previewStore';
import window from '../../ui/components/window';
import history from '../../history';
import Stage from './Stage';

import '../../network-canvas/src/styles/main.scss';

const Preview = ({ stageIndex, protocolId }) => (
  <Provider store={previewStore}>
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

// TODO: Move this elsewhere?
ipcRenderer.on('OPEN_PREVIEW', (protocolId) => {
  console.log(`Open preview: /preview/${protocolId}`);
  history.push(`/preview/${protocolId}`);
});

export default window(Preview);
