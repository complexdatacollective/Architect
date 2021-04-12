import { compose, withState, withHandlers } from 'recompose';
import { templates } from './options';
import { makeGetOptionsWithDefaults } from './defaultRule';

const VARIABLE_ALTER = 'ALTER/VARIABLE';
const TYPE_ALTER = 'ALTER/TYPE';

const alterRuleTypes = {
  VARIABLE_ALTER,
  TYPE_ALTER,
};

const alterRuleTypeOptions = [
  { label: 'Attribute - rule based on the value of this alter type\'s attributes.', value: VARIABLE_ALTER },
  { label: 'Presence - based on the presence or absence of this alter type in the interview network.', value: TYPE_ALTER },
];

const withAlterRuleType = compose(
  withState(
    'alterRuleType',
    'setAlterRuleType',
    // If an existing rule, we need to determine the type
    ({ rule }) => {
      const { options: { attribute, type } } = rule;

      if (!type) { return null; }

      const alterRuleType = attribute
        ? VARIABLE_ALTER
        : TYPE_ALTER;

      return alterRuleType;
    },
  ),
  withHandlers({
    handleChangeAlterRuleType:
      ({ setAlterRuleType, onChange, rule }) => (alterRuleType) => {
        setAlterRuleType(alterRuleType);

        const ruleTemplate = alterRuleType === TYPE_ALTER
          ? templates.alterTypeRule
          : templates.alterVariableRule;

        // 'reset' rule options, but keep type
        const options = makeGetOptionsWithDefaults(ruleTemplate)({
          type: rule.options.type,
        });

        onChange({
          ...rule,
          options,
        });
      },
  }),
);

export { withAlterRuleType, alterRuleTypes, alterRuleTypeOptions };

export default withAlterRuleType;
