import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DetachedField from '@components/DetachedField';
import NodeSelect from '@components/Form/Fields/NodeSelect';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import EditValue from './EditValue';
import Section from '../../EditorLayout/Section';
import { operatorsWithValue } from './options';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';
import {
  withAlterRuleType,
  alterRuleTypes,
  alterRuleTypeOptions,
} from './withAlterRuleType';
import { makeGetOptionsWithDefaults } from './defaultRule';

const EditAlterRule = ({
  alterRuleType,
  handleChangeAlterRuleType,
  rule,
  typeOptions,
  variableType,
  variablesAsOptions,
  variableOptions,
  operatorOptions,
  handleRuleChange,
}) => {
  const options = rule && rule.options;
  const getOptionsWithDefaults = makeGetOptionsWithDefaults(
    variableType,
    ['type', 'operator', 'attributes', 'value'],
  );
  const optionsWithDefaults = getOptionsWithDefaults(options);
  const operatorNeedsValue = operatorsWithValue.has(optionsWithDefaults.operator);
  const isVariableRule = alterRuleType === alterRuleTypes.VARIABLE_ALTER;
  const isTypeRule = alterRuleType === alterRuleTypes.TYPE_ALTER;

  return (
    <>
      <Section
        title="Alter Type"
        summary={(
          <p>
            Choose an alter type to base your rule on. Remember you can add multiple rules if
            you need to cover different alter types.
          </p>
        )}
      >
        <DetachedField
          component={NodeSelect}
          name="type"
          options={typeOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.type}
          validation={{ required: true }}
        />
      </Section>
      <Section
        title="Rule Type"
        disabled={!optionsWithDefaults.type}
      >
        <DetachedField
          component={RadioGroup}
          options={alterRuleTypeOptions}
          value={alterRuleType}
          onChange={handleChangeAlterRuleType}
        />
      </Section>
      { isTypeRule && optionsWithDefaults.type
        && (
        <Section
          title="Operator"
        >
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
      { isVariableRule && optionsWithDefaults.type
        && (
        <Section
          title="Variable"
          summary={(
            <p>
              Select a variable to query.
            </p>
          )}
        >
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
      { isVariableRule && optionsWithDefaults.attribute
        && (
        <Section
          title="Operator"
        >
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
      { isVariableRule && operatorNeedsValue
        && (
        <Section
          title="Attribute Value"
        >
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
    </>
  );
};

EditAlterRule.propTypes = {
  rule: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  typeOptions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  variablesAsOptions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  variableOptions: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
  alterRuleType: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeAlterRuleType: PropTypes.func.isRequired,
};

EditAlterRule.defaultProps = {
  variableOptions: null,
  alterRuleType: null,
  variableType: null,
};

export default compose(
  withAlterRuleType,
  withRuleChangeHandler,
  withOptions('node'),
)(EditAlterRule);
