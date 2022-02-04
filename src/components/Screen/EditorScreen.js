import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  submit, isDirty, startSubmit, isSubmitting,
} from 'redux-form';
import { Button } from '@codaco/ui';
import { actionCreators as timelineActions } from '@app/ducks/middleware/timeline';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { hasChanges as timelineHasChanges } from '@selectors/timeline';
import Screen from './Screen';
import ControlBar from '../ControlBar';

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
      header,
      secondaryButtons,
      editor: EditorComponent,
      layoutId,
      ...rest
    } = this.props;

    return (
      <Screen
        header={header}
        footer={<ControlBar buttons={this.buttons()} secondaryButtons={secondaryButtons} />}
        layoutId={layoutId}
        beforeCloseHandler={this.handleCancel}
      >
        <EditorComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
      </Screen>
    );
  }
}

EditorScreen.propTypes = {
  header: PropTypes.node,
  editor: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  hasUnsavedChanges: PropTypes.bool.isRequired,
  jump: PropTypes.func.isRequired,
  layoutId: PropTypes.string,
  locus: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  onComplete: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  secondaryButtons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  submitForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

EditorScreen.defaultProps = {
  header: null,
  layoutId: null,
  secondaryButtons: null,
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
