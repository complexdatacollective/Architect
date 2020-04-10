import { map } from 'lodash';
import { getCodebook } from '@selectors/protocol';
import { getVariableOptionsForSubject } from '@selectors/codebook';

// TODO: isUsed combine these, the option bit
export const getLayoutVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariableOptionsForSubject(state, { entity, type });

  return variables.filter(item => item.type === 'layout');
};

export const getHighlightVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariableOptionsForSubject(state, { entity, type });

  return variables.filter(item => item.type === 'boolean');
};

export const getGroupVariablesForSubject = (state, { entity, type }) => {
  const variables = getVariableOptionsForSubject(state, { entity, type });

  const categoricalOptions = variables.filter(
    item => item.type === 'categorical',
  );

  return [
    { label: '\u2014 None \u2014', value: '' },
    ...categoricalOptions,
  ];
};

export const getEdgesForSubject = (state) => {
  const codebook = getCodebook(state);

  return map(codebook.edge, (edge, edgeId) => ({
    label: edge.name,
    color: edge.color,
    value: edgeId,
  }));
};
