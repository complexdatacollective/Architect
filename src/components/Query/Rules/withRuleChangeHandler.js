import { withHandlers } from 'recompose';

const RULE_ORDER = [
  'type',
  'attribute',
  'operator',
  'value',
];

const withRuleChangeHandlers = withHandlers({
  handleRuleChange: ({ onChange, rule, variableType }) =>
    (e, value, oldValue, name) => {
      const resetAfter = RULE_ORDER.indexOf(name);

      const options = Object.entries({
        ...rule.options,
        [name]: value,
      }).reduce((acc, [optionName, optionValue]) => {
        // Reset subsequent options
        if (RULE_ORDER.indexOf(optionName) > resetAfter) {
          const newValue = variableType === 'boolean' ? false : undefined;
          return Object.assign(acc, { [optionName]: newValue });
        }
        // Or keep as is
        return Object.assign(acc, { [optionName]: optionValue });
      }, {});

      onChange({
        ...rule,
        options,
      });
    },
});

export default withRuleChangeHandlers;
