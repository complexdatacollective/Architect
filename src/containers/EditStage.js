/* eslint-disable */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import { Card } from '../containers';
import { Draft } from '../behaviours';

const defaultStage = {
};

class EditStage extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    cancel: PropTypes.bool,
    hasChanges: PropTypes.bool,
    stageId: PropTypes.number,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
    draft: PropTypes.any.isRequired,
    updateStage: PropTypes.func.isRequired,
    updateDraft: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    cancel: false,
    draft: null,
    stageId: null,
    hasChanges: false,
    onComplete: () => {},
    onCancel: () => {},
  }

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        ...this.props.draft,
      },
    );

    this.props.onComplete();
  };

  render() {
    const {
      show,
      cancel,
      onCancel,
      hasChanges,
    } = this.props;

    const buttons = [
      hasChanges ? <Button key="save" size="small" onClick={this.onSave}>Save</Button> : undefined,
      <Button key="cancel" size="small" onClick={onCancel}>Cancel</Button>,
    ];

    return (
      <Card
        title="Edit Stage"
        type="intent"
        buttons={buttons}
        show={show}
        cancel={cancel}
      >
        <div className="edit-stage" />
      </Card>
    );
  }
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props) || defaultStage;
    return { draft: stage };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditStage };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  Draft,
)(EditStage);
