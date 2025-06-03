import { withHandlers } from 'recompose';
import {
  isArray,
  isNil,
  keys,
  pick,
} from 'lodash';
import { makeGetOptionsWithDefaults } from './defaultRule';
import { operatorsWithOptionCount } from './options';

const RULE_ORDER = [
  'type',
  'attribute',
  'operator',
  'value',
];

const withRuleChangeHandlers = withHandlers({
  handleRuleChange: ({ onChange, rule, variableType }) => {
    const getOptionsWithDefaults = makeGetOptionsWithDefaults(keys(rule.options), variableType);

    return (event, value, oldValue, name) => {
      const resetFromIndex = RULE_ORDER.indexOf(name) + 1;
      const keep = RULE_ORDER.slice(0, resetFromIndex);

      // merge in updated option, and discard following (dependent) properties
      const options = pick({
        ...rule.options,
        [name]: value,
      }, keep);

      // ensure reset values have defaults
      const optionsWithDefaults = getOptionsWithDefaults(options);

      const operatorNeedsOptionCount = operatorsWithOptionCount.has(optionsWithDefaults.operator)
        && isArray(optionsWithDefaults.value);
      const countFriendlyValue = !isNil(optionsWithDefaults.value) ? optionsWithDefaults.value : '';

      onChange({
        ...rule,
        options: {
          ...optionsWithDefaults,
          value: operatorNeedsOptionCount ? '' : countFriendlyValue,
        },
      });
    };
  },
});

export default withRuleChangeHandlers;
