import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import Stage from '../../network-canvas/src/containers/Stage';
import Timeline from '../../network-canvas/src/components/Timeline';
import windowRootProvider from '../../ui/components/windowRootProvider';
import { actionCreators as sessionsActions } from '../../network-canvas/src/ducks/modules/sessions';

class Preview extends Component {
  
  componentDidMount() {
    this.setFontSize();
  }

  componentDidUpdate() {
    this.setFontSize();
  }

  setFontSize = () => {
    const root = document.documentElement;
    const newFontSize = `${(14 * this.props.interfaceScale)}px`;

    root.style.setProperty('--base-font-size', newFontSize);
  }

  setWindowRootRef = (element) => {
    this.props.setWindowRoot(element);
  }

  promptForward = () => {
    this.props.updatePrompt(
      (this.props.stage.prompts.length + this.props.promptIndex + 1) % this.props.stage.prompts.length,
    );
  }

  promptBackward = () => {
    this.props.updatePrompt(
      (this.props.stage.prompts.length + this.props.promptIndex - 1) % this.props.stage.prompts.length,
    );
  }

  render() {
    const { stage, promptIndex } = this.props;
    const percentProgress = stage && stage.prompts ? (promptIndex / stage.prompts.length) * 100 : 0;
    return (
      <div className="preview">
        <div className="network-canvas">
          <Timeline
            id="TIMELINE"
            onClickBack={this.promptBackward}
            onClickNext={this.promptForward}
            percentProgress={percentProgress}
          />
          { stage &&
            <Stage stage={stage} promptId={promptIndex} />
          }
          <div
            id="window"
            className="window"
            ref={this.setWindowRootRef}
          />
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  stage: PropTypes.object,
  promptIndex: PropTypes.number,
  setWindowRoot: PropTypes.func.isRequired,
  interfaceScale: PropTypes.number.isRequired,
  updatePrompt: PropTypes.func.isRequired,
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
    interfaceScale: state.deviceSettings.interfaceScale,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updatePrompt: bindActionCreators(sessionsActions.updatePrompt, dispatch),
  };
}

export default compose(
  windowRootProvider,
  connect(mapStateToProps, mapDispatchToProps),
)(
  Preview,
);
