import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PreviewControls from './PreviewControls';
import Stage from '../../network-canvas/src/containers/Stage';

const Preview = ({ stage, promptIndex }) => (
  <div className="preview">
    <div className="protocol">
      <div className="protocol__content">
        { stage &&
          <Stage stage={stage} promptId={promptIndex} />
        }
      </div>
    </div>
    <PreviewControls />
    <div id="window" />
  </div>
);

Preview.propTypes = {
  stage: PropTypes.object,
  promptIndex: PropTypes.number,
};

Preview.defaultProps = {
  stage: null,
  promptIndex: 0,
};

const mapStateToProps = (state, { stageIndex }) => {
  const stage = get(state, ['protocol', 'stages', stageIndex]);
  const promptIndex = state.sessions[state.session].promptIndex;

  if (!stage) { return {}; }

  return {
    stage,
    promptIndex,
  };
};

export default compose(
  connect(mapStateToProps),
)(
  Preview,
);
