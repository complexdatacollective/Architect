import { compose, withState, withHandlers } from 'recompose';
import { templates } from './options';
import { makeGetOptionsWithDefaults } from './defaultRule';

const VARIABLE_RULE = 'ALTER/VARIABLE';
const TYPE_RULE = 'ALTER/TYPE';

const entityRuleTypes = {
  VARIABLE_RULE,
  TYPE_RULE,
};

const entityRuleTypeOptions = (entityType) => [
  { label: `Attribute - rule based on the value of this ${entityType} type's attributes.`, value: VARIABLE_RULE },
  { label: `Presence - based on the presence or absence of this ${entityType} type in the interview network.`, value: TYPE_RULE },
];

const withEntityRuleType = compose(
  withState(
    'entityRuleType',
    'setEntityRuleType',
    // If an existing rule, we need to determine the type
    ({ rule }) => {
      const { options: { attribute, type } } = rule;

      if (!type) { return null; }

      const entityRuleType = attribute
        ? VARIABLE_RULE
        : TYPE_RULE;

      return entityRuleType;
    },
  ),
  withHandlers({
    handleChangeEntityRuleType:
      ({ setEntityRuleType, onChange, rule }) => (entityRuleType) => {
        setEntityRuleType(entityRuleType);

        const ruleTemplate = entityRuleType === TYPE_RULE
          ? templates.entityTypeRule
          : templates.entityVariableRule;

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

export { withEntityRuleType, entityRuleTypes, entityRuleTypeOptions };

export default withEntityRuleType;
