import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, has, get, pickBy } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import Radio from '../../Form/Fields/Radio';
import Select from '../../Form/Fields/Select';

const DEFAULT_FORM = Symbol('DEFAULT_FORM');
const CUSTOM_FORM = Symbol('CUSTOM_FORM');

class Form extends Component {
  static propTypes = {
    stage: PropTypes.object,
    forms: PropTypes.arrayOf(PropTypes.string),
    show: PropTypes.bool,
    reset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    stage: {},
    forms: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formType: props.stage.form ? CUSTOM_FORM : DEFAULT_FORM,
    };
  }

  componentWillReceiveProps({ stage: { form } }) {
    this.setState({
      formType: form ? CUSTOM_FORM : DEFAULT_FORM,
    });
  }

  onSelectFormCategory = (formType) => {
    if (formType === DEFAULT_FORM || this.props.stage.form === '') {
      this.props.reset();
    }
  };

  onClickCreateNewForm = () => {
    // TODO: Create form popin
  };

  render() {
    const { show, forms, ...rest } = this.props;

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
            <div className="stage-editor-section-form__category">
              <Radio
                label="Use a different form"
                className="stage-editor-section-form__radio"
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
            <div onClick={this.onClickCreateNewForm} className="stage-editor-section-form__category">
              <Radio
                label="Create new form..."
                className="stage-editor-section-form__radio"
                checked={false}
                readOnly
              />
            </div>
          </div>
        </Editor>
        <Guidance className="stage-editor-section__guidance">
          Which form would you like to use for these nodes?
        </Guidance>
      </Section>
    );
  }
}

const getNodeForms = (state, stage) => {
  const forms = get(state, 'protocol.present.forms', {});
  const nodeType = get(stage, 'subject.type', null);

  const validForms = pickBy(
    forms,
    form => form.type === nodeType && form.entity === 'node',
  );

  return keys(validForms);
};

const mapStateToProps = (state, props) => {
  const stage = getFormValues(props.form.name)(state);

  return {
    forms: getNodeForms(state, stage),
    show: has(stage, 'subject.type'),
    stage,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  reset: () => dispatch(changeField(form.name, 'form', null)),
});

export { Form };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Form);
