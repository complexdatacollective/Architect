import uuid from 'uuid';
import { compose, withHandlers } from 'recompose';
import validateRule from './validateRule';

const withRulesChangeHandlers = compose(
  withHandlers({
    updateJoin: (props) => (join) => props.onChange({
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
      const updateRules = rules.filter((rule) => rule.id !== ruleId);

      if (updateRules.length < 2) {
        onChange({
          rules: updateRules,
        });

        return;
      }

      onChange({
        join,
        rules: updateRules,
      });
    },
  }),
  withHandlers({
    handleChangeJoin: ({ updateJoin }) => (join) => updateJoin(join),
    handleSaveDraft: (props) => () => {
      const {
        draftRule, openDialog, updateRule, resetDraft,
      } = props;

      if (!validateRule(draftRule)) {
        openDialog({
          type: 'Warning',
          title: 'Please complete all fields',
          message: 'To create your rule, all fields are required. Please complete all fields before clicking save, or use cancel to abandon this rule.',
          canCancel: false,
        });
        return;
      }

      updateRule(draftRule);
      resetDraft();
    },
    handleDeleteRule: ({ openDialog, deleteRule }) => (ruleId) => openDialog({
      type: 'Confirm',
      title: 'Are you sure you want to delete this rule?',
      onConfirm: () => deleteRule(ruleId),
    }),
  }),
);

export default withRulesChangeHandlers;
