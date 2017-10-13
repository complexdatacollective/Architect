/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import Timeline from './Timeline';
import Stage from './Stage';
import CardTransition from '../components/CardTransition';
import ScreenTransition from '../components/ScreenTransition';
import { actionCreators as stageActions } from '../ducks/modules/stages';

const defaultStageState = {
  insertAtIndex: null,
  editId: null,
  cancel: false,
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

  onStageCancel = () => {
    this.setState({
      stage: {
        cancel: true,
      },
    }, () => {
      this.setState({
        stage: {
          ...defaultStageState,
        },
      });
    });
  }

  onStageUpdated = () => {
    this.setState({
      stage: { ...defaultStageState },
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

  onEditStage = (id) => {
    this.setState({
      stage: {
        ...defaultStageState,
        editId: id,
      },
    });
  };

  showStage = () => (!!this.state.stage.editId || !!this.state.stage.insertAtIndex);

  render() {
    return (
      <div className="interview">
        <ScreenTransition
          key="timeline"
          in={!this.showStage()}
          unmountOnExit
        >
          <Timeline
            items={this.props.stages}
            onInsertStage={this.onInsertStage}
          />
        </ScreenTransition>
        <CardTransition
          key="stage"
          in={this.showStage()}
          unmountOnExit
          cancel={this.state.stage.cancel}
        >
          <Stage
            id={this.state.stage.editId}
            index={this.state.stage.insertAtIndex}
            onComplete={this.onStageUpdated}
            onCancel={this.onStageCancel}
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

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
