import { Provider } from 'react-redux';
import React from 'react';
import previewStore from '../../ducks/previewStore';
import Preview from './Preview';

const PreviewContainer = () => (
  <Provider store={previewStore}>
    <Preview />
  </Provider>
);

export default PreviewContainer;
