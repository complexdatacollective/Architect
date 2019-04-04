import { formValueSelector } from 'redux-form';
import { getCodebook } from '../../../selectors/protocol';
import { utils as codebookUtils, getVariablesForNodeType } from '../../../selectors/codebook';
import { utils as indexUtils, getVariableIndex } from '../../../selectors/indexes';

export const getLayoutVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props.nodeType);
  const variableOptions = codebookUtils.asOptions(variables);
  const layoutOptions = variableOptions.filter(({ type }) => type === 'layout');

  return layoutOptions;
};

export const getHighlightVariablesForNodeType = (
  state,
  { form, nodeType, formUsedVariableIndex },
) => {
  // Currently selected variable
  const currentVariable = formValueSelector(form)(state, 'highlight.variable');

  // All defined variables that match nodeType
  const variables = getVariablesForNodeType(state, nodeType);
  const variableOptions = codebookUtils.asOptions(variables);

  // variables that are already used in protocol
  const variableIndex = getVariableIndex(state);

  // Build a Set which whe can check variable ids against
  const lookup = indexUtils.buildSearch(
    [variableIndex, formUsedVariableIndex], // include
    [[currentVariable]], // exclude
  );

  // Boolean variables which aren't already used (+ currently selected)
  const highlightVariables = variableOptions.filter(
    ({ type, value }) => type === 'boolean' &&
    !lookup.has(value),
  );

  return highlightVariables;
};

export const getEdgesForNodeType = (state) => {
  const codebook = getCodebook(state);
  const codebookOptions = codebookUtils.asOptions(codebook.edge);

  return codebookOptions;
};
