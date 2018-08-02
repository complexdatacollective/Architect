import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, map, get, pickBy } from 'lodash';
import Guidance from '../../Guidance';
import EditForm from '../../Cards/EditForm';
import { Radio } from '../../../ui/components/Fields';
import Select from '../../Form/Fields/Select';

const DEFAULT_FORM = Symbol('DEFAULT_FORM');
const CUSTOM_FORM = Symbol('CUSTOM_FORM');

const categoryClasses = (disabled = false) =>
  cx(
    'stage-editor-section-form__category',
    { 'stage-editor-section-form__category--disabled': disabled },
  );
class Form extends Component {
  static propTypes = {
    forms: PropTypes.arrayOf(PropTypes.string),
    selectedForm: PropTypes.string,
    disabled: PropTypes.bool,
    nodeType: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    selectedForm: null,
    forms: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formType: props.selectedForm ? CUSTOM_FORM : DEFAULT_FORM,
      editForm: false,
    };
  }

  componentWillReceiveProps({ selectedForm }) {
    this.setState({
      formType: selectedForm ? CUSTOM_FORM : DEFAULT_FORM,
    });
  }

  handleSelectFormCategory = (formType) => {
    if (formType === DEFAULT_FORM || this.props.selectedForm === '') {
      this.props.reset();
    }
  };

  handleClickCreateNewForm = () => {
    this.showFormEditor();
  };

  handleEditFormComplete = (form) => {
    if (form.type === this.props.nodeType) {
      this.props.change(form.title);
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
    } = this.props;

    const formClasses = cx(
      'stage-editor-section',
      { 'stage-editor-section--disabled': disabled },
    );

    return (
      <Guidance contentId="guidance.editor.form">
        <div className={formClasses}>
          <h2>Form</h2>
          <p>Which form should be used to create and edit nodes on this stage?</p>
          <div className="stage-editor-section-form">
            <div className="stage-editor-section-form__category">
              <Radio
                label="Use the default node form"
                className="stage-editor-section-form__radio"
                input={
                  {
                    onChange: () => this.handleSelectFormCategory(DEFAULT_FORM),
                    checked: this.state.formType === DEFAULT_FORM,
                  }
                }
                readOnly
              />
            </div>
            <div className={categoryClasses(forms.length === 0)}>
              <Radio
                label="Use a different form"
                className="stage-editor-section-form__radio"
                disabled={forms.length === 0}
                input={
                  {
                    checked: this.state.formType === CUSTOM_FORM,
                  }
                }
                readOnly
              />
              <div className="stage-editor-section-form__custom">
                <Field
                  name="form"
                  component={Select}
                >
                  <option disabled="disabled" value="">Select a form...</option>
                  { forms.map(formName => (
                    <option value={formName} key={formName}>
                      {formName}
                    </option>
                  )) }
                </Field>
              </div>
            </div>
            <div onClick={this.handleClickCreateNewForm} className={categoryClasses()}>
              <Radio
                label="Create new form..."
                className="stage-editor-section-form__radio"
                checked={false}
                input={{}}
                disabled
                readOnly
              />
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

const getNodeForms = (state, nodeType) => {
  const forms = get(state, 'protocol.present.forms', {});

  const validForms = pickBy(
    toPairs(forms),
    ([name, form]) =>
      form.type === nodeType && form.entity === 'node' && name !== nodeType,
  );

  return map(validForms, 0);
};

const mapStateToProps = (state, props) => {
  const formValues = props.form.getValues(state, 'subject', 'form');
  const nodeType = get(formValues, 'subject.type', null);
  const selectedForm = get(formValues, 'form', null);

  return {
    nodeType,
    forms: getNodeForms(state, nodeType),
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
