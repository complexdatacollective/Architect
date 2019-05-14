import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { getFieldId } from '../../utils/issues';
import * as Fields from '../../ui/components/Fields';
import ValidatedField from '../Form/ValidatedField';
import Select from '../Form/Fields/Select';
import { isVariableTypeWithOptions, variableOptions } from '../Form/inputOptions';
import Options from '../Options';
import Section from '../sections/Section';
import FormWindow from '../FormWindow';
import withNewVariableHandler, { form } from './withNewVariableHandler';
import { validateName } from '../../utils/validations';

const NewVariableWindow = ({
  show,
  variableType,
  allowVariableTypes,
  handleCreateNewVariable,
  existingVariableNames,
  onCancel,
  initialValues,
}) => {
  const filteredVariableOptions = allowVariableTypes ?
    variableOptions.filter(
      ({ value: optionVariableType }) =>
        allowVariableTypes.includes(optionVariableType),
    ) :
    variableOptions;

  return (
    <FormWindow
      show={show}
      form={form}
      onSubmit={handleCreateNewVariable}
      onCancel={onCancel}
      initialValues={initialValues}
      existingVariableNames={existingVariableNames}
    >
      <Section contentId="guidance.newVariable.name">
        <h3 id={getFieldId('name')}>Variable name</h3>
        <p>
          Enter a name for this variable. The variable name is how you will reference
          the variable elsewhere, including in exported data.
        </p>
        <Field
          name="name"
          component={Fields.Text}
          placeholder="e.g. Nickname"
          validate={validateName}
        />
      </Section>
      <Section contentId="guidance.newVariable.type">
        <h3 id={getFieldId('type')}>Variable type</h3>
        <p>Choose a variable type</p>
        <ValidatedField
          name="type"
          component={Select}
          placeholder="Select variable type"
          options={filteredVariableOptions}
          validation={{ required: true }}
        />
      </Section>
      { isVariableTypeWithOptions(variableType) &&
        <Section contentId="guidance.newVariable.options">
          <h3 id={getFieldId('options')}>Options</h3>
          <p>Create some options for this input control</p>
          <Options
            name="options"
            label="Options"
            form={form}
          />
        </Section>
      }
    </FormWindow>
  );
};

NewVariableWindow.propTypes = {
  show: PropTypes.bool,
  variableType: PropTypes.string,
  allowVariableTypes: PropTypes.array,
  // This prop is required by withNewVariableHandler
  // eslint-disable-next-line
  onComplete: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  existingVariableNames: PropTypes.array.isRequired,
};

NewVariableWindow.defaultProps = {
  show: false,
  variableType: null,
  allowVariableTypes: null,
  initialValues: null,
};

export { NewVariableWindow };

export default withNewVariableHandler(NewVariableWindow);
