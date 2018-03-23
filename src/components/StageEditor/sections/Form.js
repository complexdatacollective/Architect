/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, getFormValues, change as changeForm } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, pickBy, isNull } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import { OptionsInput } from '../../../components/Form';

const DEFAULT_FORM = Symbol('DEFAULT_FORM');
const CUSTOM_FORM = Symbol('CUSTOM_FORM');

class Form extends Component {
  static propTypes = {
    stage: PropTypes.object,
    forms: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
      this.props.dispatch(changeForm('edit-stage', 'form', null));
    }
  };

  onClickCreateNewForm = () => {
    // TODO: Create form popin
  };

  render() {
    const { stage: { form }, show, forms, dispatch, ...props } = this.props;

    return (
      <Section className="stage-editor-section" show={show} {...props}>
        <Editor className="stage-editor-section__edit">
          <h2>Form</h2>
          <p>Which form should be used to create and edit nodes on this stage?</p>
          <label onClick={() => this.onSelectFormCategory(DEFAULT_FORM)}>
            <input type="radio" checked={this.state.formType === DEFAULT_FORM} readOnly />
            Use the default node form
          </label>
          <div>
            <label>
              <input type="radio" checked={this.state.formType === CUSTOM_FORM} readOnly  />
              Use a different form
            </label>
            <Field
              name="form"
              component="select"
            >
              <option disabled="disabled" value="">Select a form...</option>
              { forms.map((formName) =>
                <option value={formName} key={formName}>
                  {formName}
                </option>)
              }
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

const getForms = (state, stage) => {
  const forms = get(state, 'protocol.present.forms', {});
  const nodeType = get(stage, 'subject.type', null);

  const validForms = pickBy(forms, form => {
    return form.type === nodeType && form.entity === 'node';
  });

  return keys(validForms);
};

const mapStateToProps = (state, props) => {
  const stage = getFormValues('edit-stage')(state);

  return {
    forms: getForms(state, stage),
    show: get(props, 'stage.subject.type', false),
    stage,
  };
};

export { Form };

export default compose(
  connect(mapStateToProps),
)(Form);
