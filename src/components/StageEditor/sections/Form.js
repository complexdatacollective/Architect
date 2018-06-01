import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { keys, get, pickBy } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import Radio from '../../Form/Fields/Radio';
import Select from '../../Form/Fields/Select';

const DEFAULT_FORM = Symbol('DEFAULT_FORM');
const CUSTOM_FORM = Symbol('CUSTOM_FORM');

class Form extends Component {
  static propTypes = {
    forms: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.string,
    show: PropTypes.bool,
    reset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    form: null,
    forms: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formType: props.form ? CUSTOM_FORM : DEFAULT_FORM,
    };
  }

  componentWillReceiveProps({ form }) {
    this.setState({
      formType: form ? CUSTOM_FORM : DEFAULT_FORM,
    });
  }

  onSelectFormCategory = (formType) => {
    if (formType === DEFAULT_FORM || this.props.form === '') {
      this.props.reset();
    }
  };

  onClickCreateNewForm = () => {
    // TODO: Create form popin
  };

  render() {
    const { show, forms, ...rest } = this.props;

    const categoryClasses = (disabled = false) =>
      cx(
        'stage-editor-section-form__category',
        { 'stage-editor-section-form__category--disabled': disabled },
      );

    return (
      <Section className="stage-editor-section" show={show} {...rest}>
        <Editor className="stage-editor-section__edit">
          <h2>Form</h2>
          <p>Which form should be used to create and edit nodes on this stage?</p>
          <div className="stage-editor-section-form">
            <div className="stage-editor-section-form__category">
              <Radio
                label="Use the default node form"
                className="stage-editor-section-form__radio"
                input={
                  {
                    onChange: () => this.onSelectFormCategory(DEFAULT_FORM),
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
            <div onClick={this.onClickCreateNewForm} className={categoryClasses(true)}>
              <Radio
                label="Create new form..."
                className="stage-editor-section-form__radio"
                checked={false}
                disabled
                readOnly
              />
            </div>
          </div>
        </Editor>
        <Guidance className="stage-editor-section__guidance">
          <p>
            {'Now you have selected a node type, you must decide which form is shown to the participant when they create a new node.'}
          </p>
          <p>
            {'By default, Network Canvas will generate a node form for you, which will contain all of the variables you have assigned to this node type in the variable registry. If this is appropriate to your needs, you can skip this section.'}
          </p>
          <p>
            {'However, you should consider which variables must be collected here, and which are better collected later, using a specific interview stage. Be mindful that asking the participant to fill out a long form each time they create a new node will dramatically increase response burden.'}
          </p>
        </Guidance>
      </Section>
    );
  }
}

const getNodeForms = (state, nodeType) => {
  const forms = get(state, 'protocol.present.forms', {});

  const validForms = pickBy(
    forms,
    form => form.type === nodeType && form.entity === 'node',
  );

  return keys(validForms);
};

const mapStateToProps = (state, props) => {
  const formValues = props.form.getValues(state, 'subject', 'form');
  const nodeType = get(formValues, 'subject.type', null);
  const form = get(formValues, 'form', null);

  return {
    forms: getNodeForms(state, nodeType),
    show: !!nodeType,
    form,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  reset: () => dispatch(changeField(form.name, 'form', null)),
});

export { Form };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Form);
