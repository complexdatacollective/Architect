import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { isOrdinalOrCategoricalType, VARIABLE_OPTIONS } from '@app/config/variables';
import { getFieldId } from '@app/utils/issues';
import { required, uniqueByList, allowedVariableName } from '@app/utils/validations';
import safeName from '@app/utils/safeName';
import ValidatedField from '@components/Form/ValidatedField';
import Select from '@components/Form/Fields/Select';
import Options from '@components/Options';
import { Section } from '@components/EditorLayout';
import InlineEditScreen from '@components/InlineEditScreen';
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
      ? VARIABLE_OPTIONS.filter(
        ({ value: optionVariableType }) => allowVariableTypes.includes(optionVariableType),
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
          summary={(
            <p>
              Enter a name for this variable. The variable name is how you will reference
              the variable elsewhere, including in exported data.
            </p>
          )}
        >
          <div id={getFieldId('name')} />
          <Field
            name="name"
            component={Fields.Text}
            placeholder="e.g. Nickname"
            validate={[isRequired, this.validateName, isAllowedVariableName]}
            normalize={safeName}
          />
        </Section>
        <Section
          title="Variable Type"
          summary={(
            <p>Choose a variable type</p>
          )}
        >
          <div id={getFieldId('type')} />
          <ValidatedField
            name="type"
            component={Select}
            placeholder="Select variable type"
            options={this.filteredVariableOptions()}
            isDisabled={!!initialValues.type}
            validation={{ required: true }}
          />
        </Section>
        { isOrdinalOrCategoricalType(variableType)
          && (
          <Section
            title="Options"
            summary={(
              <p>Create some options for this input control</p>
            )}
          >
            <div id={getFieldId('options')} />
            <Options
              name="options"
              label="Options"
              form={form}
            />
          </Section>
          )}
      </InlineEditScreen>
    );
  }
}

NewVariableWindow.propTypes = {
  show: PropTypes.bool,
  variableType: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  allowVariableTypes: PropTypes.array,
  // eslint-disable-next-line
  onComplete: PropTypes.func.isRequired, // This prop is required by withNewVariableHandler
  handleCreateNewVariable: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
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
