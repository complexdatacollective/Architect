import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty, isInvalid } from 'redux-form';
import { get } from 'lodash';
import { Button } from '../../ui/components';
import FormEditor from '../FormEditor';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as formActions } from '../../ducks/modules/protocol/forms';

class Form extends PureComponent {
  static propTypes = {
    formName: PropTypes.string,
    form: PropTypes.object,
    updateForm: PropTypes.func.isRequired,
    createForm: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    hasErrors: PropTypes.bool,
    onComplete: PropTypes.func.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    formName: null,
    form: {},
    show: true,
    hasErrors: false,
    hasUnsavedChanges: false,
  };

  onSubmit = (form) => {
    if (this.props.formName) {
      this.props.updateForm(this.props.formName, form);
    } else {
      this.props.createForm(form);
    }

    this.props.onComplete();
  }

  submitForm = () => {
    this.props.submitForm('edit-form');
  }

  renderButtons() {
    const saveButton = (
      <Button
        key="save"
        size="small"
        onClick={this.submitForm}
        color="white"
        iconPosition="right"
        disabled={this.props.hasErrors}
      >
        Save
      </Button>
    );

    return this.props.hasUnsavedChanges ? [saveButton] : [];
  }

  render() {
    const {
      form,
      show,
    } = this.props;

    return (
      <Card
        buttons={this.renderButtons()}
        show={show}
        onCancel={this.props.onComplete}
      >
        <FormEditor
          initialValues={form}
          onSubmit={this.onSubmit}
        />
      </Card>
    );
  }
}

const editFormIsDirty = isDirty('edit-form');
const editFormIsInvalid = isInvalid('edit-form');

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
  submitForm: bindActionCreators(submit, dispatch),
  updateForm: bindActionCreators(formActions.updateForm, dispatch),
  createForm: bindActionCreators(formActions.createForm, dispatch),
});

export { Form };

export default connect(mapStateToProps, mapDispatchToProps)(Form);
