import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, map, get, pickBy } from 'lodash';
import Guidance from '../../../Guidance';
import ValidatedField from '../../../Form/ValidatedField';
import EditForm from '../../../Cards/EditForm';
import { Icon } from '../../../../ui/components';
import { RadioGroup } from '../../../../ui/components/Fields';
import { getProtocol } from '../../../../selectors/protocol';
import FormCard from './FormCard';

const formOption = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

class Form extends Component {
  static propTypes = {
    forms: PropTypes.arrayOf(formOption),
    disabled: PropTypes.bool,
    nodeType: PropTypes.string,
    change: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    selectedForm: null,
    nodeType: null,
    forms: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      editForm: false,
    };
  }

  handleClickCreateNewForm = () => {
    this.showFormEditor();
  };

  handleEditFormComplete = (result) => {
    if (!result) { this.closeFormEditor(); return; }

    const { formName, form } = result;

    // Thes form editor UI allows us to select different node types from
    // the one selected here, so we can't assume that they match.
    if (form.type === this.props.nodeType) {
      this.props.change(formName);
    }

    this.closeFormEditor();
  };

  showFormEditor = () => {
    this.setState({ editForm: true });
  };

  closeFormEditor = () => {
    this.setState({ editForm: false });
  };

  render() {
    const {
      forms,
      disabled,
      nodeType,
    } = this.props;

    const formClasses = cx(
      'stage-editor-section',
      { 'stage-editor-section--disabled': disabled },
    );

    return (
      <Guidance contentId="guidance.editor.form">
        <div className={formClasses}>
          <h2 id="issue-form">Form</h2>
          <p>Which form should be used to create and edit nodes on this stage?</p>
          <div className="stage-editor-section-form">
            <ValidatedField
              name="form"
              component={RadioGroup}
              className="stage-editor-section-form__cards"
              format={value => (value === '' ? null : value)}
              defaultValue={nodeType}
              optionComponent={FormCard}
              options={forms}
              validation={{ requiredAcceptsNull: true }}
            />

            <div className="stage-editor-section-form__new-form">
              <div
                className="stage-editor-section-form__new-form-button"
                onClick={this.handleClickCreateNewForm}
              >
                <Icon name="add" title="Create new form..." />
              </div>
            </div>
          </div>

          <EditForm
            show={this.state.editForm}
            onComplete={this.handleEditFormComplete}
            onCancel={this.closeFormEditor}
          />
        </div>
      </Guidance>
    );
  }
}

const getNodeFormOptions = (forms, nodeType) => {
  const formsAsPairs = toPairs(forms);

  const validForms = pickBy(
    formsAsPairs,
    ([, form]) =>
      form.type === nodeType && form.entity === 'node',
  );

  const asOptions = map(
    validForms,
    ([name, form]) =>
      ({ value: name, label: form.title }),
  );

  return [{ value: null, label: null }]
    .concat(asOptions);
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const formValues = props.form.getValues(state, 'subject', 'form');
  const nodeType = get(formValues, 'subject.type', null);
  const selectedForm = get(formValues, 'form', undefined);
  const formOptions = getNodeFormOptions(protocol.forms, nodeType);

  return {
    nodeType,
    forms: formOptions,
    disabled: !nodeType,
    selectedForm,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  reset: () => dispatch(changeField(form.name, 'form', null)),
  change: value => dispatch(changeField(form.name, 'form', value)),
});

export { Form };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Form);
