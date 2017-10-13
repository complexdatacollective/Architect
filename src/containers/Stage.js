import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import StageForm from './StageForm';

class Stage extends PureComponent {
  static propTypes = {
    addStage: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    // id: PropTypes.string,
    index: PropTypes.number,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    onCancel: () => {},
    id: null,
    index: null,
  }

  onSubmit = (values) => {
    const {
      index,
    } = this.props;

    if (index) {
      this.props.addStage(values, index);
    }
    this.props.onComplete();
  }

  render() {
    return (
      <div className="stage">
        Stage
        <StageForm
          initialValues={this.props.initialValues}
          onSubmit={this.onSubmit}
        />
        <button onClick={this.props.onCancel}>cancel</button>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  let initialValues = {};

  if (props.id) {
    initialValues = find(this.props.stages, props.id);
  }

  return {
    stages: state.stages,
    initialValues,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addStage: bindActionCreators(stageActions.addStage, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
