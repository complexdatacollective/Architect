import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit, isDirty, startSubmit, isSubmitting } from 'redux-form';
import { Button } from '../../ui/components';
import { actionCreators as timelineActions } from '../../ducks/middleware/timeline';
import { actionCreators as dialogActions } from '../../ducks/modules/dialogs';
import Screen from './Screen';

class EditorScreen extends Component {
  handleSubmit = () => {
    if (this.props.submitting) { return; }

    this.props.submitForm();
  }

  cancel() {
    this.props.jump(this.props.locus);
    this.props.onComplete();
  }

  handleCancel = () => {
    if (!this.props.hasUnsavedChanges) {
      this.cancel();
      return;
    }

    this.props.openDialog({
      type: 'Warning',
      title: 'Unsaved changes will be lost',
      message: 'Unsaved changes will be lost, do you want to continue?',
      confirmLabel: 'OK',
      onConfirm: () => this.cancel(),
    });
  };

  buttons() {
    const saveButton = (
      <Button
        key="save"
        onClick={this.handleSubmit}
        iconPosition="right"
        disabled={this.props.submitting}
      >
        Continue
      </Button>
    );

    const cancelButton = (
      <Button
        key="cancel"
        onClick={this.handleCancel}
        color="platinum"
        iconPosition="right"
      >
        Cancel
      </Button>
    );

    return this.props.hasUnsavedChanges ? [saveButton, cancelButton] : [cancelButton];
  }

  render() {
    const {
      show,
      secondaryButtons,
      transitionState,
      editor: Editor,
      ...rest
    } = this.props;

    return (
      <Screen
        buttons={this.buttons()}
        secondaryButtons={secondaryButtons}
        show={show}
        transitionState={transitionState}
      >
        <Editor
          {...rest}
        />
      </Screen>
    );
  }
}

EditorScreen.defaultProps = {
  secondaryButtons: null,
};

const mapStateToProps = (state, { form }) => ({
  hasUnsavedChanges: isDirty(form)(state),
  submitting: isSubmitting(form)(state),
});

const mapDispatchToProps = (dispatch, { form }) => ({
  submitForm: () => {
    dispatch(startSubmit(form));
    dispatch(submit(form));
  },
  jump: bindActionCreators(timelineActions.jump, dispatch),
  openDialog: bindActionCreators(dialogActions.openDialog, dispatch),
});

export { EditorScreen };

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);
