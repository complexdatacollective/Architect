import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty } from 'redux-form';
import { get } from 'lodash';
import memoryHistory from '../../history';
import { Button } from '../../ui/components';
import FormEditor from '../FormEditor';
import ControlBar from '../ControlBar';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as formActions } from '../../ducks/modules/protocol/forms';

class Form extends PureComponent {
  static propTypes = {
    formName: PropTypes.string,
    form: PropTypes.object,
    updateForm: PropTypes.func.isRequired,
    createForm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    formName: null,
    form: {},
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

  render() {
    const {
      form,
      hasUnsavedChanges,
    } = this.props;

    return (
      <div>
        <FormEditor
          initialValues={form}
          onSubmit={this.handleSubmit}
        />

        <ControlBar show={hasUnsavedChanges}>
          <Button
            size="small"
            onClick={this.submitForm}
            color="white"
            iconPosition="right"
          >
            Save
          </Button>
        </ControlBar>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const protocol = getProtocol(state);
  const formName = get(props.match.params, 'form', null);
  const form = get(protocol, ['forms', formName], {});

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
