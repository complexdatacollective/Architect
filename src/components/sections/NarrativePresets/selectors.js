import { getTypes, getVariables, asOption, propertyMaps } from '@selectors/codebook';

export const getLayoutVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariables(state, { includeDraft: true, entity, type })
    .filter(({ properties }) => properties.type === 'layout');

  return variables.map(asOption());
};

export const getHighlightVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariables(state, { includeDraft: true, entity, type })
    .filter(({ properties }) => properties.type === 'boolean');

  return variables.map(asOption());
};

export const getGroupVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariables(state, { includeDraft: true, entity, type })
    .filter(({ properties }) => properties.type === 'categorical');

  const categoricalOptions = variables.map(asOption());

  return [
    { label: '\u2014 None \u2014', value: '' },
    ...categoricalOptions,
  ];
};

export const getEdgesForSubject = (state) => {
  const edges = getTypes(state, { includeDraft: true })
    .filter(({ subject }) => subject.entity === 'edge');

  const options = edges.map(asOption(propertyMaps.entity));

  return options;
};
