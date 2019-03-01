import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { submit, isDirty } from 'redux-form';
import { Button } from '../../ui/components';
import Card from './ProtocolCard';

class EditScreen extends PureComponent {
  get buttons() {
    const saveButton = (
      <Button
        key="save"
        onClick={this.props.submitForm}
        iconPosition="right"
      >
        Continue
      </Button>
    );

    return this.props.hasUnsavedChanges ? [saveButton] : [];
  }

  handleCancel = this.props.onComplete;

  render() {
    const {
      show,
      transitionState,
      editor: Editor,
      ...rest
    } = this.props;

    return (
      <Card
        buttons={this.buttons}
        show={show}
        transitionState={transitionState}
        onCancel={this.handleCancel}
      >
        <Editor {...rest} />
      </Card>
    );
  }
}

const mapStateToProps = (state, { form }) => ({
  hasUnsavedChanges: isDirty(form)(state),
});

const mapDispatchToProps = (dispatch, { form }) => ({
  submitForm: () => dispatch(submit(form)),
});

export { EditScreen };

export default connect(mapStateToProps, mapDispatchToProps)(EditScreen);
