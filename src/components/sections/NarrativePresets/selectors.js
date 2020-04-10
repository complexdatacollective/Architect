import { map } from 'lodash';
import { getCodebook } from '@selectors/protocol';
import { getVariableOptionsForSubject } from '@selectors/codebook';

const noneOption = { label: '\u2014 None \u2014', value: '' };

export const getNarrativeVariables = (state, subject) => {
  const variables = getVariableOptionsForSubject(state, subject);

  const layoutVariblesForSubject = variables.filter(({ type }) => type === 'layout');
  const highlightVariablesForSubject = variables.filter(({ type }) => type === 'boolean');
  const categoricalOptions = variables.filter(({ type }) => type === 'categorical');
  const groupVariablesForSubject = [noneOption, ...categoricalOptions];

  return {
    layoutVariblesForSubject,
    highlightVariablesForSubject,
    groupVariablesForSubject,
  };
};

export const getEdgesForSubject = (state) => {
  const codebook = getCodebook(state);

  return map(codebook.edge, (edge, edgeId) => ({
    label: edge.name,
    color: edge.color,
    value: edgeId,
  }));
};
