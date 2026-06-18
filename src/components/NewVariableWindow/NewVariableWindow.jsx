import {
  isOrdinalOrCategoricalType,
  VARIABLE_OPTIONS,
} from '@app/config/variables';
import safeName from '@app/utils/safeName';
import {
  allowedVariableName,
  required,
  uniqueByList,
} from '@app/utils/validations';
import { Section } from '@components/EditorLayout';
import Select from '@components/Form/Fields/Select';
import ValidatedField from '@components/Form/ValidatedField';
import InlineEditScreen from '@components/InlineEditScreen';
import Options from '@components/Options';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Field } from 'redux-form';

import * as Fields from '@codaco/ui/lib/components/Fields';

import withNewVariableHandler, { form } from './withNewVariableHandler';

const isRequired = required();

const isAllowedVariableName = allowedVariableName();

class NewVariableWindow extends Component {
  validateName = (value) => {
    const { existingVariableNames } = this.props;
    return uniqueByList(existingVariableNames)(value);
  };

  filteredVariableOptions() {
    const { allowVariableTypes } = this.props;

    return allowVariableTypes
      ? VARIABLE_OPTIONS.filter(({ value: optionVariableType }) =>
          allowVariableTypes.includes(optionVariableType),
        )
      : VARIABLE_OPTIONS;
  }

  render() {
    const {
      show,
      variableType,
      handleCreateNewVariable,
      onCancel,
      initialValues,
    } = this.props;

    return (
      <InlineEditScreen
        show={show}
        form={form}
        onSubmit={handleCreateNewVariable}
        onCancel={onCancel}
        initialValues={initialValues}
        title="Create New Variable"
      >
        <Section
          title="Variable Name"
          summary={
            <p>
              Enter a name for this variable. The variable name is how you will
              reference the variable elsewhere, including in exported data.
            </p>
          }
          id="name"
        >
          <Field
            name="name"
            component={Fields.Text}
            placeholder="e.g. Nickname"
            validate={[isRequired, this.validateName, isAllowedVariableName]}
            normalize={safeName}
          />
        </Section>
        <Section title="Variable Type" summary={<p>Choose a variable type</p>}>
          <ValidatedField
            name="type"
            component={Select}
            placeholder="Select variable type"
            options={this.filteredVariableOptions()}
            isDisabled={!!initialValues.type}
            validation={{ required: true }}
          />
        </Section>
        {isOrdinalOrCategoricalType(variableType) && (
          <Section
            title="Options"
            summary={<p>Create some options for this input control</p>}
            id="options"
          >
            <Options name="options" label="Options" form={form} />
          </Section>
        )}
      </InlineEditScreen>
    );
  }
}

NewVariableWindow.propTypes = {
  show: PropTypes.bool,
  variableType: PropTypes.string,
  allowVariableTypes: PropTypes.array,
  onComplete: PropTypes.func.isRequired, // This prop is required by withNewVariableHandler
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

export default withNewVariableHandler(NewVariableWindow);
