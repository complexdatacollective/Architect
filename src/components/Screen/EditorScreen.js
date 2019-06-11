import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit, isDirty, startSubmit, isSubmitting } from 'redux-form';
import { Button } from '../../ui/components';
import { actionCreators as timemachineActions } from '../../ducks/middleware/timemachine';
import Screen from './Screen';

class EditorScreen extends Component {
  handleSubmit = () => {
    if (this.props.submitting) { return; }

    this.props.submitForm();
  }

  handleCancel = () => {
    this.props.jump(this.props.locus);
    this.props.onComplete();
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
  jump: bindActionCreators(timemachineActions.jump, dispatch),
});

export { EditorScreen };

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);
