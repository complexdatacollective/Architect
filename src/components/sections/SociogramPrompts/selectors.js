import { getTypes, getVariables, asOption, propertyMaps } from '@selectors/codebook';

export const getLayoutVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariables(state, { subject: { entity, type } })
    .filter(({ properties }) => properties.type === 'layout');
  return variables.map(asOption());
};

export const getHighlightVariablesForSubject = (
  state,
  { type, entity },
) => {
  const variables = getVariables(state, { subject: { entity, type } })
    .filter(({ properties }) => properties.type === 'boolean');
  return variables.map(asOption());
};

export const getEdgesForSubject = (state) => {
  const edges = getTypes(state)
    .filter(({ subject }) => subject.entity === 'edge');
  const codebookOptions = edges.map(asOption(propertyMaps.entity));

  return codebookOptions;
};
