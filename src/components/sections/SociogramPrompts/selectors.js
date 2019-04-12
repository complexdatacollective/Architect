import { formValueSelector } from 'redux-form';
import { getCodebook } from '../../../selectors/protocol';
import { utils as codebookUtils, getVariablesForSubject } from '../../../selectors/codebook';
import { utils as indexUtils, getVariableIndex } from '../../../selectors/indexes';

export const getLayoutVariablesForSubject = (state, props) => {
  const variables = getVariablesForSubject(state, props.nodeType);
  const variableOptions = codebookUtils.asOptions(variables);
  const layoutOptions = variableOptions.filter(({ type }) => type === 'layout');

  return layoutOptions;
};

export const getHighlightVariablesForSubject = (
  state,
  { form, type, entity, formUsedVariableIndex },
) => {
  // Currently selected variable
  const currentVariable = formValueSelector(form)(state, 'highlight.variable');

  // All defined variables that match nodeType
  const variables = getVariablesForSubject(state, { entity, type });
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
    ({ type: variableType, value }) => variableType === 'boolean' &&
    !lookup.has(value),
  );

  return highlightVariables;
};

export const getEdgesForSubject = (state) => {
  const codebook = getCodebook(state);
  const codebookOptions = codebookUtils.asOptions(codebook.edge);

  return codebookOptions;
};
