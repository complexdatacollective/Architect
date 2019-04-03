import { getCodebook } from '../../../selectors/protocol';
import { utils as codebookUtils, getVariablesForNodeType } from '../../../selectors/codebook';
import { utils as indexUtils, getVariableIndex } from '../../../selectors/indexes';

export const getLayoutVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props.nodeType);
  const variableOptions = codebookUtils.asOptions(variables);
  const layoutOptions = variableOptions.filter(({ type }) => type === 'layout');

  return layoutOptions;
};

export const getHighlightVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props.nodeType);
  const variableOptions = codebookUtils.asOptions(variables);
  const variableLookup = indexUtils.getLookup(getVariableIndex(state));

  const highlightVariables = variableOptions.filter(
    ({ type, value }) => type === 'boolean' &&
    !variableLookup.has(value),
  );

  return highlightVariables;
};

export const getEdgesForNodeType = (state) => {
  const codebook = getCodebook(state);
  const codebookOptions = codebookUtils.asOptions(codebook.edge);

  return codebookOptions;
};
