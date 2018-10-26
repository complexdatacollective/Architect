import { Provider } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import previewStore from '../../ducks/previewStore';
import Preview from './Preview';

const PreviewContainer = ({ match }) => (
  <Provider store={previewStore}>
    <Preview stageIndex={get(match, 'params.stageIndex', 0)} />
  </Provider>
);

PreviewContainer.propTypes = {
  match: PropTypes.object,
};

PreviewContainer.defaultProps = {
  match: null,
};

export default PreviewContainer;
