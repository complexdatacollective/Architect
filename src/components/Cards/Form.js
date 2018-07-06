import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty } from 'redux-form';
import { get } from 'lodash';
import memoryHistory from '../../history';
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
    show: PropTypes.bool,
  };

  static defaultProps = {
    formName: null,
    form: {},
    show: true,
    hasUnsavedChanges: false,
  };

  handleSubmit = (form) => {
    if (this.props.formName) {
      this.props.updateForm(this.props.formName, form);
    } else {
      this.props.createForm(form);
    }
  }

  submitForm = () => {
    this.props.submitForm('edit-form');
    memoryHistory.go(-1); // TODO: make this more explicit
  }

  handleCancel = () => {
    memoryHistory.go(-1); // TODO: make this more explicit
  }

  renderButtons() {
    const saveButton = (
      <Button
        size="small"
        onClick={this.submitForm}
        color="white"
        iconPosition="right"
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

function mapStateToProps(state, props) {
  const protocol = getProtocol(state);
  const formName = get(props.match, 'params.form', null);
  const form = get(protocol, ['forms', formName], { optionToAddAnother: false });

  return {
    form,
    formName,
    hasUnsavedChanges: !formName || isDirty('edit-form')(state),
  };
}

const mapDispatchToProps = dispatch => ({
  submitForm: bindActionCreators(submit, dispatch),
  updateForm: bindActionCreators(formActions.updateForm, dispatch),
  createForm: bindActionCreators(formActions.createForm, dispatch),
});

export { Form };

export default connect(mapStateToProps, mapDispatchToProps)(Form);
