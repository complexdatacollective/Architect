import { withHandlers } from 'recompose';
import { keys, pick } from 'lodash';
import { makeGetOptionsWithDefaults } from './defaultRule';

const RULE_ORDER = [
  'type',
  'attribute',
  'operator',
  'value',
];

const withRuleChangeHandlers = withHandlers({
  handleRuleChange: ({ onChange, rule, variableType }) => {
    console.log(keys(rule.options));
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

      console.log("it's me", { options, optionsWithDefaults });

      onChange({
        ...rule,
        options: optionsWithDefaults,
      });
    };
  },
});

export default withRuleChangeHandlers;
