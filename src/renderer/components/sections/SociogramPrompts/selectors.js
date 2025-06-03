import { getCodebook } from '@selectors/protocol';
import { getVariableOptionsForSubject } from '@selectors/codebook';
import { asOptions } from '@selectors/utils';
import { formValueSelector } from 'redux-form';

export const getLayoutVariablesForSubject = (state, { entity, type }) => {
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });
  const layoutOptions = variableOptions.filter(
    ({ type: variableType }) => variableType === 'layout',
  );

  return layoutOptions;
};

export const getHighlightVariablesForSubject = (
  state,
  { type, entity },
) => {
  // All defined variables that match nodeType
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });

  // Boolean variables which aren't already used (+ currently selected)
  const highlightVariables = variableOptions.filter(
    ({ type: variableType }) => variableType === 'boolean',
  );

  return highlightVariables;
};

export const getEdgesForSubject = (state) => {
  const codebook = getCodebook(state);
  const codebookOptions = asOptions(codebook.edge);

  return codebookOptions;
};

export const getEdgeFilters = (state) => {
  const getStageValue = formValueSelector('edit-stage');
  const currentFilters = getStageValue(state, 'filter');

  if (!currentFilters || !currentFilters.rules) {
    return [];
  }
  const edgeFilters = currentFilters.rules.filter((rule) => rule.type === 'edge');

  return edgeFilters;
};
