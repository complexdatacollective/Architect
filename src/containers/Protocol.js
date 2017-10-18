import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Timeline from './Timeline';
import NewStage from './NewStage';
import { ScreenTransition, CardTransition } from '../components';
import { actionCreators as stageActions } from '../ducks/modules/stages';

const defaultStageState = {
  insertAtIndex: null,
  cancel: false,
};

class Protocol extends PureComponent {
  static propTypes = {
    stages: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      stage: { ...defaultStageState },
    };
  }

  onCancelNewStage = () => {
    this.setState({
      stage: {
        ...defaultStageState,
        cancel: true,
      },
    });
  }

  onNewStageAdded = () => {
    this.setState({
      stage: {
        ...defaultStageState,
      },
    });
  }

  onInsertStage = (index) => {
    this.setState({
      stage: {
        ...defaultStageState,
        insertAtIndex: index,
      },
    });
  };

  showNewStage = () => this.state.stage.insertAtIndex !== null;
  showTimeline = () => !this.showNewStage();

  render() {
    return (
      <div className="protocol">
        <ScreenTransition
          key="timeline"
          in={this.showTimeline()}
        >
          <Timeline
            stages={this.props.stages}
            onInsertStage={this.onInsertStage}
          />
        </ScreenTransition>
        <CardTransition
          key="new-stage"
          in={this.showNewStage()}
          cancel={this.state.stage.cancel}
        >
          <NewStage
            index={this.state.stage.insertAtIndex}
            onComplete={this.onNewStageAdded}
            onCancel={this.onCancelNewStage}
          />
        </CardTransition>
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

export default connect(mapStateToProps, mapDispatchToProps)(Protocol);
