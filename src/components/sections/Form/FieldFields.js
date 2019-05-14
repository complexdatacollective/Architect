import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, change, Field } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as Fields from '../../../ui/components/Fields';
import Select from '../../Form/Fields/Select';
import Options from '../../Options';
import Validations from '../../Validations';
import SelectOptionImage from '../../Form/Fields/SelectOptionImage';
import inputOptions, { getTypeForComponent, isVariableTypeWithOptions } from '../../Form/inputOptions';
import { validateName } from '../../../utils/validations';
import Row from '../Row';
import Section from '../Section';

const mapStateToProps = (state, { form }) => {
  const formSelector = formValueSelector(form);
  const component = formSelector(state, 'component');
  const variableType = getTypeForComponent(component);

  return {
    variableType,
  };
};

const mapDispatchToProps = {
  changeField: change,
};

const handlers = {
  handleChangeComponent: ({ changeField, form }) =>
    () => {
      changeField(form, 'options', null);
      changeField(form, 'validation', {});
    },
};

const PromptFields = ({
  form,
  variableType,
  handleChangeComponent,
}) => (
  <Section>
    <Row contentId="guidance.section.form.field.name">
      <h3 id={getFieldId('name')}>Variable name</h3>
      <p>
        Enter a name for this variable. The variable name is how you will
        reference the variable elsewhere, including in exported data.
      </p>
      <Field
        name="name"
        component={Fields.Text}
        placeholder="e.g. Name"
        validate={validateName}
      />
    </Row>
    <Row contentId="guidance.section.form.field.prompt">
      <h3 id={getFieldId('prompt')}>Question prompt</h3>
      <p>Enter question for the particpant. e.g. What is this person&apos;s name?</p>
      <ValidatedField
        name="prompt"
        component={Fields.Text}
        placeholder="What is this person's name?"
        validation={{ required: true }}
      />
    </Row>
    <Row contentId="guidance.section.form.field.component">
      <h3 id={getFieldId('component')}>Input control</h3>
      <p>Choose an input control that should be used to collect the answer.</p>
      <ValidatedField
        name="component"
        component={Select}
        placeholder="Select component"
        options={inputOptions}
        selectOptionComponent={SelectOptionImage}
        validation={{ required: true }}
        onChange={handleChangeComponent}
      />
    </Row>
    { isVariableTypeWithOptions(variableType) &&
      <Row contentId="guidance.section.form.field.Options">
        <h3 id={getFieldId('options')}>Categorical/Ordinal options</h3>
        <p>
          The input type you selected indicates that this is a categorical or ordinal variable.
          Next, please create a minimum of two possible values for the participant to choose
          between.
        </p>
        <Options
          name="options"
          label="Options"
          form={form}
        />
      </Row>
    }
    { variableType &&
      <Row contentId="guidance.section.form.field.validation">
        <h3 id={getFieldId('validation')}>Validation</h3>
        <p>Select any input requirements that you would like to enforce.</p>
        <Validations
          form={form}
          name="validation"
          variableType={variableType}
        />
      </Row>
    }
  </Section>
);

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variableType: PropTypes.string,
  handleChangeComponent: PropTypes.func.isRequired,
};

PromptFields.defaultProps = {
  variableType: null,
};

export { PromptFields };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(handlers),
)(PromptFields);
