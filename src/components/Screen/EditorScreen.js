import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit, isDirty, startSubmit, isSubmitting } from 'redux-form';
import { Button } from '@codaco/ui';
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
      editor: EditorComponent,
      ...rest
    } = this.props;

    return (
      <Screen
        buttons={this.buttons()}
        secondaryButtons={secondaryButtons}
        show={show}
        transitionState={transitionState}
      >
        {({ windowRoot }) => (
          <EditorComponent
            {...rest}
            windowRoot={windowRoot}
          />
        )}
      </Screen>
    );
  }
}

EditorScreen.propTypes = {
  submitting: PropTypes.bool.isRequired,
  submitForm: PropTypes.func.isRequired,
  jump: PropTypes.func.isRequired,
  locus: PropTypes.any.isRequired,
  onComplete: PropTypes.func.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  openDialog: PropTypes.func.isRequired,
  show: PropTypes.propTypes.bool,
  secondaryButtons: PropTypes.array,
  transitionState: PropTypes.string,
  editor: PropTypes.any.isRequired,
};

EditorScreen.defaultProps = {
  secondaryButtons: null,
  show: true,
  transitionState: null,
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
