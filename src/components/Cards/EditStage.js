import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  submit as submitForm,
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { pick, has } from 'lodash';
import { makeGetStage } from '../../selectors/protocol';
import { Button } from '../../ui/components';
import { ProtocolCard } from '../../containers/ProtocolCard';
import StageEditor from '../../components/StageEditor';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';

class EditStage extends PureComponent {
  static propTypes = {
    dirty: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    continue: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    stageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    insertAtIndex: PropTypes.number,
    updateStage: PropTypes.func.isRequired,
    createStage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    stageId: null,
    insertAtIndex: null,
    type: null,
  };

  onUpdate = (stage) => {
    const { stageId, insertAtIndex } = this.props;

    if (stageId) {
      this.props.updateStage(stageId, stage);
    } else {
      this.props.createStage(stage, insertAtIndex);
    }

    this.props.onComplete();
  }

  get isDirty() {
    return this.props.dirty || !has(this.props.stage, 'id');
  }

  renderButtons() {
    return [].concat(
      this.isDirty ? [<Button key="continue" size="small" disabled={this.props.invalid} onClick={this.props.continue}>Continue</Button>] : [],
    );
  }

  render() {
    const { stage } = this.props;

    return (
      <ProtocolCard
        buttons={this.renderButtons()}
        {...pick(this.props, ['show', 'className', 'onCancel'])}
      >
        <StageEditor
          stage={stage}
          onSubmit={this.onUpdate}
        />
      </ProtocolCard>
    );
  }
}

const makeMapStateToProps = () => {
  const getStage = makeGetStage();

  return (state, props) => {
    const stage = getStage(state, props) || { type: props.type };

    return ({
      stage,
      dirty: isFormDirty('edit-stage')(state),
      invalid: isFormInvalid('edit-stage')(state),
    });
  };
};

const mapDispatchToProps = dispatch => ({
  continue: () => dispatch(submitForm('edit-stage')),
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  createStage: bindActionCreators(stageActions.createStage, dispatch),
});

export { EditStage };

export default connect(makeMapStateToProps, mapDispatchToProps)(EditStage);
