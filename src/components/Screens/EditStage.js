import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import {
  submit as submitForm,
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { has, find } from 'lodash';
import { Button } from '../../ui/components';
import Card from './ProtocolCard';
import StageEditor from '../../components/StageEditor';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import { actionCreators as previewActions } from '../../ducks/modules/preview';

const formName = 'edit-stage';

class EditStage extends PureComponent {
  static propTypes = {
    dirty: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    submitForm: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    stage: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    insertAtIndex: PropTypes.number,
    updateStage: PropTypes.func.isRequired,
    createStage: PropTypes.func.isRequired,
    previewStage: PropTypes.func.isRequired,
    closePreview: PropTypes.func.isRequired,
    transitionState: PropTypes.string,
  };

  static defaultProps = {
    id: null,
    insertAtIndex: null,
    onComplete: () => {},
    transitionState: null,
  };

  get isDirty() {
    return this.props.dirty || !has(this.props.stage, 'id');
  }

  get buttons() {
    return this.isDirty ? [
      <Button
        key="continue"
        onClick={this.props.submitForm}
      >Continue</Button>,
    ] : [];
  }

  get secondaryButtons() {
    return [
      <Button
        key="preview"
        onClick={this.handlePreview}
        color="paradise-pink"
        disabled={this.props.invalid}
      >Preview</Button>,
    ];
  }

  handleComplete = () => {
    this.props.closePreview(); // Hide preview
    this.props.onComplete();
  }

  handlePreview = () => this.props.previewStage();

  handleSubmit = (stage) => {
    const { id, insertAtIndex } = this.props;

    if (id) {
      this.props.updateStage(id, stage);
    } else {
      this.props.createStage(stage, insertAtIndex);
    }

    this.handleComplete();
  }

  handleCancel = this.handleComplete;

  render() {
    const { stage, show, transitionState } = this.props;

    return (
      <Card
        buttons={this.buttons}
        secondaryButtons={this.secondaryButtons}
        show={show}
        transitionState={transitionState}
        onCancel={this.handleCancel}
      >
        <StageEditor
          stage={stage}
          form={formName}
          onSubmit={this.handleSubmit}
          previewStage={this.props.previewStage}
        />
      </Card>
    );
  }
}

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const stage = find(protocol.stages, ['id', props.id]) || { type: props.type };

  return ({
    stage,
    dirty: isFormDirty(formName)(state),
    invalid: isFormInvalid(formName)(state),
  });
};

const mapDispatchToProps = (dispatch, props) => {
  const stageMeta = {
    id: props.id,
  };

  return {
    submitForm: () => dispatch(submitForm(formName)),
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
    createStage: bindActionCreators(stageActions.createStage, dispatch),
    closePreview: bindActionCreators(previewActions.closePreview, dispatch),
    previewStage: () => dispatch(previewActions.previewStageByFormName(stageMeta, formName)),
  };
};

export { EditStage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EditStage);
