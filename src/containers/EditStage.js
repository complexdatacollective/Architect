/* eslint-disable */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import { ProtocolCard } from '../containers/ProtocolCard';
import { Draft } from '../behaviours';

const defaultStage = {
};

class EditStage extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    hasChanges: PropTypes.bool,
    stageId: PropTypes.number,
    onComplete: PropTypes.func,
    draft: PropTypes.any.isRequired,
    updateStage: PropTypes.func.isRequired,
    updateDraft: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    draft: null,
    stageId: null,
    hasChanges: false,
    onComplete: () => {},
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

  renderButtons() {
    return [].concat(
      this.props.hasChanges ? [<Button key="save" size="small" onClick={this.onSave}>Save</Button>] : [],
    );
  }

  render() {
    const {
      show,
      onCancel,
    } = this.props;

    return (
      <ProtocolCard
        title="Edit Stage"
        buttons={this.renderButtons()}
        show={show}
        onCancel={onCancel}
      >
        <div className="edit-stage" />
      </ProtocolCard>
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
