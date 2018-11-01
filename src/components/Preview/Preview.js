import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PreviewControls from './PreviewControls';
import Stage from '../../network-canvas/src/containers/Stage';
import windowRootProvider from '../../ui/components/windowRootProvider';

class Preview extends Component {
  setWindowRootRef = (element) => {
    this.props.setWindowRoot(element);
  }

  render() {
    const { stage, promptIndex } = this.props;

    return (
      <div className="preview">
        <div className="protocol">
          <div className="protocol__content">
            { stage &&
              <Stage stage={stage} promptId={promptIndex} />
            }
          </div>
        </div>
        <PreviewControls />
        <div id="window" ref={this.setWindowRootRef} />
      </div>
    );
  }
}

Preview.propTypes = {
  stage: PropTypes.object,
  promptIndex: PropTypes.number,
  setWindowRoot: PropTypes.func.isRequired,
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
  windowRootProvider,
  connect(mapStateToProps),
)(
  Preview,
);
