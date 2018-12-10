import { withHandlers } from 'recompose';

const RULE_ORDER = [
  'type',
  'variable',
  'operator',
  'value',
];

const withRuleChangeHandler = withHandlers({
  handleRuleChange: props =>
    (e, value, oldValue, name) => {
      const resetAfter = RULE_ORDER.indexOf(name);

      const options = Object.entries({
        ...props.rule.options,
        [name]: value,
      }).reduce((acc, [optionName, optionValue]) => {
        // Reset subsequent options
        if (RULE_ORDER.indexOf(optionName) > resetAfter) { return acc; }
        // Or keep as is
        return Object.assign(acc, { [optionName]: optionValue });
      }, {});

      props.onChange({
        ...props.rule,
        options,
      });
    },
});

export default withRuleChangeHandler;
