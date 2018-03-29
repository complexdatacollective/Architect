import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, has, get, pickBy, uniqueId } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';

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

  componentWillMount() {
    this.id = uniqueId('label');
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
    const { show, forms } = this.props;

    return (
      <Section className="stage-editor-section" show={show}>
        <Editor className="stage-editor-section__edit">
          <h2>Form</h2>
          <p>Which form should be used to create and edit nodes on this stage?</p>
          <label htmlFor={`${this.id}_default`}>
            <input
              id={`${this.id}_default`}
              type="radio"
              onChange={() => this.onSelectFormCategory(DEFAULT_FORM)}
              checked={this.state.formType === DEFAULT_FORM}
              readOnly
            />
            Use the default node form
          </label>
          <div>
            <label htmlFor={`${this.id}_custom`}>
              <input
                type="radio"
                checked={this.state.formType === CUSTOM_FORM}
                id={`${this.id}_custom`}
                readOnly
              />
              Use a different form
            </label>
            <Field
              name="form"
              component="select"
            >
              <option disabled="disabled" value="">Select a form...</option>
              { forms.map(formName => (
                <option value={formName} key={formName}>
                  {formName}
                </option>
              )) }
            </Field>
          </div>
          <div onClick={this.onClickCreateNewForm}>
            <input type="radio" checked={false} />
            Create new form...
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
