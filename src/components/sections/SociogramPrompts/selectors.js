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

export const getHighlightVariablesForNodeType = (state, props) => {
  // Currently selected variable
  const currentVariable = formValueSelector(props.form)(state, 'highlight.variable');

  // All defined variables that match nodeType
  const variables = getVariablesForNodeType(state, props.nodeType);
  const variableOptions = codebookUtils.asOptions(variables);

  // Already used in protocol
  const variableLookup = indexUtils.getLookup(getVariableIndex(state));
  // Already used in form, i.e. current draft
  const unsavedLookup = indexUtils.getLookup(props.formUsedVariableIndex);

  // Currently selected variable is always available
  variableLookup.delete(currentVariable);
  unsavedLookup.delete(currentVariable);

  // Boolean variables which aren't already used (+ currently selected)
  const highlightVariables = variableOptions.filter(
    ({ type, value }) => type === 'boolean' &&
    !variableLookup.has(value) &&
    !unsavedLookup.has(value),
  );

  return highlightVariables;
};

export const getEdgesForNodeType = (state) => {
  const codebook = getCodebook(state);
  const codebookOptions = codebookUtils.asOptions(codebook.edge);

  return codebookOptions;
};
