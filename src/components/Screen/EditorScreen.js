import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  submit, isDirty, startSubmit, isSubmitting,
} from 'redux-form';
import { Button } from '@codaco/ui';
import { actionCreators as timelineActions } from '../../ducks/middleware/timeline';
import { actionCreators as dialogActions } from '../../ducks/modules/dialogs';
import Screen from './Screen';

class EditorScreen extends Component {
  handleSubmit = () => {
    const { submitting, submitForm } = this.props;
    if (submitting) { return; }

    submitForm();
  }

  handleCancel = () => {
    const { hasUnsavedChanges, openDialog } = this.props;
    if (!hasUnsavedChanges) {
      this.cancel();
      return;
    }

    openDialog({
      type: 'Warning',
      title: 'Unsaved changes will be lost',
      message: 'Unsaved changes will be lost, do you want to continue?',
      confirmLabel: 'OK',
      onConfirm: () => this.cancel(),
    });
  };

  cancel() {
    const { jump, onComplete, locus } = this.props;
    jump(locus);
    onComplete();
  }

  buttons() {
    const { submitting, hasUnsavedChanges } = this.props;
    const saveButton = (
      <Button
        key="save"
        onClick={this.handleSubmit}
        iconPosition="right"
        icon="arrow-right"
        disabled={submitting}
      >
        Finished Editing
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

    return hasUnsavedChanges ? [cancelButton, saveButton] : [cancelButton];
  }

  render() {
    const {
      show,
      secondaryButtons,
      transitionState,
      editor: EditorComponent,
      ...rest
    } = this.props;

    const { locus, timeline } = this.props;
    console.log({ locus, timeline });

    return (
      <Screen
        buttons={this.buttons()}
        secondaryButtons={secondaryButtons}
        show={show}
        transitionState={transitionState}
      >
        {({ windowRoot }) => (
          <EditorComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
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
  // eslint-disable-next-line react/forbid-prop-types
  locus: PropTypes.any.isRequired,
  onComplete: PropTypes.func.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  openDialog: PropTypes.func.isRequired,
  show: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  secondaryButtons: PropTypes.array,
  transitionState: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  editor: PropTypes.any.isRequired,
};

EditorScreen.defaultProps = {
  secondaryButtons: null,
  show: true,
  transitionState: null,
};

const timelineHasChanges = (state, locus) => {
  const { timeline } = state.protocol;
  return timeline.findIndex((id) => id === locus) < timeline.length - 1;
};

const mapStateToProps = (state, { form, locus }) => ({
  hasUnsavedChanges: isDirty(form)(state) || timelineHasChanges(state, locus),
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);
