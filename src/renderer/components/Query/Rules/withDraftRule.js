import { compose, withState, withHandlers } from 'recompose';
import { templates } from './options';
import { getDefaultOptions } from './defaultRule';

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
    createDraft: ({ setDraftRule }) => (type, options) => setDraftRule(generateRule(type, options)),
  }),
  withHandlers({
    handleCreateAlterRule: ({ createDraft }) => () => createDraft('alter', getDefaultOptions(templates.alterTypeRule)),
    handleCreateEdgeRule: ({ createDraft }) => () => createDraft('edge', getDefaultOptions(templates.edgeTypeRule)),
    handleCreateEgoRule: ({ createDraft }) => () => createDraft('ego', getDefaultOptions(templates.egoRule)),
    handleClickRule: ({ startDraft }) => (ruleId) => startDraft(ruleId),
    handleChangeDraft: ({ setDraftRule }) => (rule) => setDraftRule(rule),
    handleCancelDraft: ({ resetDraft }) => () => resetDraft(),
  }),
);

export default withDraftRule;
