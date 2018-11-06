import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Stage from '../../network-canvas/src/containers/Stage';
import windowRootProvider from '../../ui/components/windowRootProvider';

class Preview extends Component {
  componentDidMount() {
    this.setFontSize();
  }

  componentDidUpdate() {
    this.setFontSize();
  }

  setFontSize = () => {
    const root = document.documentElement;
    // const newFontSize = `${(1.75 * this.props.interfaceScale)}vmin`;
    const newFontSize = `${(14 * this.props.interfaceScale)}px`;

    root.style.setProperty('--base-font-size', newFontSize);
  }

  setWindowRootRef = (element) => {
    this.props.setWindowRoot(element);
  }

  render() {
    const { stage, promptIndex } = this.props;

    return (
      <div className="preview">
        <div className="network-canvas">
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
    // interfaceScale: 1,
  };
};

export default compose(
  windowRootProvider,
  connect(mapStateToProps),
)(
  Preview,
);
