import uuid from 'uuid';
import { compose, withHandlers } from 'recompose';
import validateRule from './validateRule';

const withRulesChangeHandlers = compose(
  withHandlers({
    updateJoin: props => join =>
      props.onChange({
        join,
        rules: props.rules,
      }),
    updateRule: ({ rules, join, onChange }) => (rule) => {
      let updatedRules = [];

      if (!rule.id) {
        updatedRules = [
          ...rules,
          { ...rule, id: uuid() },
        ];
      } else {
        updatedRules = rules.map(
          (existingRule) => {
            if (existingRule.id === rule.id) { return rule; }
            return existingRule;
          },
        );
      }

      onChange({
        join,
        rules: updatedRules,
      });
    },
    deleteRule: ({ join, rules, onChange }) => (ruleId) => {
      const updateRules = rules.filter(rule => rule.id !== ruleId);

      onChange({
        join,
        rules: updateRules,
      });
    },
  }),
  withHandlers({
    handleChangeJoin: ({ updateJoin }) => join => updateJoin(join),
    handleSaveDraft: props => () => {
      const { draftRule, openDialog, updateRule, resetDraft } = props;

      if (!validateRule(draftRule)) {
        openDialog({
          type: 'Warning',
          title: 'Please complete all fields',
          canCancel: false,
        });
        return;
      }

      updateRule(draftRule);
      resetDraft();
    },
    handleDeleteRule: ({ openDialog, deleteRule }) => ruleId =>
      openDialog({
        type: 'Confirm',
        title: 'Are you sure you want to delete this rule?',
        onConfirm: () => deleteRule(ruleId),
      }),
  }),
);

export default withRulesChangeHandlers;
