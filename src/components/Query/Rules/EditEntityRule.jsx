import DetachedField from '@components/DetachedField';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import { isArray, isNil } from 'lodash';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';

import Section from '../../EditorLayout/Section';
import EntitySelectField from '../../sections/fields/EntitySelectField/EntitySelectField';
import { makeGetOptionsWithDefaults } from './defaultRule';
import EditValue from './EditValue';
import {
  operatorsWithOptionCount,
  operatorsWithRegExp,
  operatorsWithValue,
} from './options';
import {
  entityRuleTypeOptions,
  entityRuleTypes,
  withEntityRuleType,
} from './withEntityRuleType';
import withOptions from './withOptions';
import withRuleChangeHandler from './withRuleChangeHandler';

const EditEntityRule = ({
  entityRuleType,
  handleChangeEntityRuleType,
  rule,
  typeOptions,
  variableType,
  variablesAsOptions,
  variableOptions,
  operatorOptions,
  handleRuleChange,
}) => {
  const { type: entityType } = rule;
  const options = rule?.options;
  const getOptionsWithDefaults = makeGetOptionsWithDefaults(variableType, [
    'type',
    'operator',
    'attributes',
    'value',
  ]);
  const optionsWithDefaults = getOptionsWithDefaults(options);
  const operatorNeedsValue = operatorsWithValue.has(
    optionsWithDefaults.operator,
  );
  const operatorNeedsRegExp = operatorsWithRegExp.has(
    optionsWithDefaults.operator,
  );
  const isVariableRule = entityRuleType === entityRuleTypes.VARIABLE_RULE;
  const isTypeRule = entityRuleType === entityRuleTypes.TYPE_RULE;
  const operatorNeedsOptionCount = operatorsWithOptionCount.has(
    optionsWithDefaults.operator,
  );
  const countFriendlyValue = !isNil(optionsWithDefaults.value)
    ? optionsWithDefaults.value
    : '';
  const optionsWithCounts = {
    ...optionsWithDefaults,
    value: isArray(optionsWithDefaults.value) ? '' : countFriendlyValue,
  };

  return (
    <>
      <Section
        title={`${entityType} Type`}
        summary={
          <p>
            Choose an {entityType} type to base your rule on. Remember you can
            add multiple rules if you need to cover different types.
          </p>
        }
      >
        <DetachedField
          component={EntitySelectField}
          entityType={entityType === 'alter' ? 'node' : 'edge'}
          name="type"
          issueDescription={`${entityType} Type`}
          options={typeOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.type}
          validation={{ required: true }}
        />
      </Section>
      <Section title="Rule Type" disabled={!optionsWithDefaults.type}>
        <DetachedField
          name="entityRuleType"
          component={RadioGroup}
          options={entityRuleTypeOptions(entityType)}
          value={entityRuleType}
          onChange={handleChangeEntityRuleType}
        />
      </Section>
      {isTypeRule && optionsWithDefaults.type && (
        <Section title="Operator">
          <DetachedField
            component={RadioGroup}
            name="operator"
            options={operatorOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.operator}
            validation={{ required: true }}
          />
        </Section>
      )}
      {isVariableRule && optionsWithDefaults.type && (
        <Section title="Variable" summary={<p>Select a variable to query.</p>}>
          <DetachedField
            component={NativeSelect}
            name="attribute"
            options={variablesAsOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.attribute}
            validation={{ required: true }}
          />
        </Section>
      )}
      {isVariableRule && optionsWithDefaults.attribute && (
        <Section title="Operator">
          <DetachedField
            component={NativeSelect}
            name="operator"
            options={operatorOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.operator}
            validation={{ required: true }}
          />
        </Section>
      )}
      {isVariableRule && operatorNeedsValue && (
        <Section title="Attribute Value">
          <EditValue
            variableType={variableType}
            placeholder="Enter a value..."
            onChange={handleRuleChange}
            value={optionsWithDefaults.value}
            options={variableOptions}
            validation={{ required: true }}
          />
        </Section>
      )}
      {isVariableRule && operatorNeedsRegExp && (
        <Section title="Attribute Value">
          <EditValue
            variableType={variableType}
            placeholder="Enter a regular expression..."
            onChange={handleRuleChange}
            value={optionsWithDefaults.value}
            options={variableOptions}
            validation={{ required: true, validRegExp: true }}
          />
        </Section>
      )}
      {isVariableRule && operatorNeedsOptionCount && (
        <Section title="Selected Option Count">
          <EditValue
            variableType="number"
            placeholder="Enter a value..."
            onChange={handleRuleChange}
            value={optionsWithCounts.value}
            validation={{ requiredAcceptsZero: true }}
          />
        </Section>
      )}
    </>
  );
};

EditEntityRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
    type: PropTypes.string,
  }).isRequired,
  typeOptions: PropTypes.array.isRequired,
  variablesAsOptions: PropTypes.array.isRequired,
  variableOptions: PropTypes.array,
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
  entityRuleType: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeEntityRuleType: PropTypes.func.isRequired,
};

EditEntityRule.defaultProps = {
  variableOptions: null,
  entityRuleType: null,
  variableType: null,
};

export default compose(
  withEntityRuleType,
  withRuleChangeHandler,
  withOptions,
)(EditEntityRule);
