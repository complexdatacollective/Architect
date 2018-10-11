import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty, isInvalid } from 'redux-form';
import { get } from 'lodash';
import { Button } from '../../ui/components';
import FormEditor, { formName as reduxFormName } from '../FormEditor';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as formActions } from '../../ducks/modules/protocol/forms';

const formNameFromTitle = title => title.replace(/\W/g, '');

class EditForm extends PureComponent {
  static propTypes = {
    formName: PropTypes.string,
    form: PropTypes.object,
    updateForm: PropTypes.func.isRequired,
    createForm: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    onComplete: PropTypes.func.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    formName: null,
    form: {},
    show: true,
    hasUnsavedChanges: false,
  };

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

  handleSubmit = (form) => {
    if (this.props.formName) {
      this.props.updateForm(this.props.formName, form);
    } else {
      this.props.createForm(formNameFromTitle(form.title), form);
    }

    this.props.onComplete({
      formName: this.props.formName || formNameFromTitle(form.title),
      form,
    });
  }

  handleCancel = () => {
    this.props.onComplete();
  }

  render() {
    const {
      form,
      show,
    } = this.props;

    return (
      <Card
        buttons={this.buttons}
        show={show}
        onCancel={this.handleCancel}
      >
        <FormEditor
          initialValues={form}
          onSubmit={this.handleSubmit}
        />
      </Card>
    );
  }
}

const editFormIsDirty = isDirty(reduxFormName);
const editFormIsInvalid = isInvalid(reduxFormName);

function mapStateToProps(state, props) {
  const protocol = getProtocol(state);
  const formName = get(props.match, 'params.form', null);
  const form = get(protocol, ['forms', formName], { optionToAddAnother: false });

  return {
    form,
    formName,
    hasUnsavedChanges: !formName || editFormIsDirty(state),
    hasErrors: editFormIsInvalid(state),
  };
}

const mapDispatchToProps = dispatch => ({
  submitForm: () => dispatch(submit(reduxFormName)),
  updateForm: bindActionCreators(formActions.updateForm, dispatch),
  createForm: bindActionCreators(formActions.createForm, dispatch),
});

export { EditForm };

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);
