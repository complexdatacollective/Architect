import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import Timeline from './Timeline';
import Stage from './Stage';
import Fade from '../components/Fade';
import { actionCreators as stageActions } from '../ducks/modules/stages';

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
        <TransitionGroup>
          {!this.showStage() &&
            <Fade key="timeline">
              <Timeline
                items={this.props.stages}
                onInsertStage={this.onInsertStage}
              />
            </Fade>
          }
          {this.showStage() &&
            <Fade key="stage">
              <Stage
                id={this.state.stage.editId}
                index={this.state.stage.insertAtIndex}
                onComplete={this.onStageUpdated}
              />
            </Fade>
          }
        </TransitionGroup>
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
