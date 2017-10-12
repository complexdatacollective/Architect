/* eslint-disable */

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Timeline from './Timeline';
import Stage from './Stage';
import { actionCreators as stageActions } from '../ducks/modules/stages';

class Interview extends PureComponent {
  static propTypes = {
    addStage: PropTypes.func.isRequired,
    stages: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      stage: null,
    };
  }

  onInsertStage = (index) => {
    this.setState({
      stage: {
        index: 0,
      },
    });
  };

  render() {
    return (
      <div className="interview">
        { !this.state.stage &&
          <Timeline
            items={this.props.stages}
            onInsertStage={this.onInsertStage}
          />
        }

        { this.state.stage &&
          <Stage
            stage={this.state.stage}
          />
        }
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
