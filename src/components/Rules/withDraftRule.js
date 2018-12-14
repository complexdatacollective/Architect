import { compose, withState, withHandlers } from 'recompose';

const generateRule = (type, options = {}) => ({
  type,
  options: { operator: undefined, ...options },
});

const withDraftRule = compose(
  withState('draftRule', 'setDraftRule', null),
  withHandlers({
    resetDraft: ({ setDraftRule }) => () => setDraftRule(null),
    startDraft: ({ setDraftRule, rules }) => (ruleId) => {
      const rule = rules.find(({ id }) => id === ruleId);
      setDraftRule(rule);
    },
    createDraft: ({ setDraftRule }) => (type, options) =>
      setDraftRule(generateRule(type, options)),
  }),
  withHandlers({
    handleCreateAlterTypeRule: ({ createDraft }) => () => createDraft('alter', { type: undefined }),
    handleCreateAlterVariableRule: ({ createDraft }) => () =>
      createDraft('alter', { type: undefined, variable: undefined, value: undefined }),
    handleCreateEdgeRule: ({ createDraft }) => () => createDraft('edge', { type: undefined }),
    handleCreateEgoRule: ({ createDraft }) => () =>
      createDraft('ego', { variable: undefined, value: undefined }),
    handleClickRule: ({ startDraft }) => ruleId => startDraft(ruleId),
    handleChangeDraft: ({ setDraftRule }) => rule => setDraftRule(rule),
    handleCancelDraft: ({ resetDraft }) => () => resetDraft(),
  }),
);

export default withDraftRule;
