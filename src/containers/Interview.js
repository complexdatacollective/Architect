import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';
import Timeline from './Timeline';
import Stage from './Stage';
import { actionCreators as stageActions } from '../ducks/modules/stages';

const Fade = ({ show, children }) => (
  <Transition
    key="timeline"
    in={show}
    onExit={
      (el) => {
        anime({
          targets: el,
          opacity: 0,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: 300,
        });
      }
    }
    timeout={animation.duration.standard}
  >
    {state => state !== 'exited' && children}
  </Transition>
);

Fade.propTypes = {
  children: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
};

const defaultStageState = {
  insertAtIndex: null,
  editId: null,
};

class Interview extends PureComponent {
  static propTypes = {
    stages: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      stage: { ...defaultStageState },
    };
  }

  onStageUpdated = () => {
    this.setState({
      stage: { ...defaultStageState },
    });
  }

  onInsertStage = (index) => {
    this.setState({
      stage: {
        ...this.state.stage,
        insertAtIndex: index,
      },
    });
  };

  onEditStage = (id) => {
    this.setState({
      stage: {
        ...this.state.stage,
        editId: id,
      },
    });
  };

  showStage = () => (!!this.state.stage.editId || !!this.state.stage.insertAtIndex);

  render() {
    return (
      <div className="interview">
        <Fade show={!this.showStage()}>
          <Timeline
            items={this.props.stages}
            onInsertStage={this.onInsertStage}
          />
        </Fade>
        <Fade show={this.showStage()}>
          <Stage
            id={this.state.stage.editId}
            index={this.state.stage.insertAtIndex}
            onComplete={this.onStageUpdated}
          />
        </Fade>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stages: state.stages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addStage: bindActionCreators(stageActions.addStage, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
