import { map } from 'lodash';
import { getCodebook } from '../../../../selectors/protocol';
import { getVariableOptionsForNodeType } from '../../../../selectors/codebook';

export const getLayoutVariablesForNodeType = (state, nodeType) => {
  const variables = getVariableOptionsForNodeType(state, nodeType);

  return variables.filter(item => item.type === 'layout');
};

export const getHighlightVariablesForNodeType = (state, nodeType) => {
  const variables = getVariableOptionsForNodeType(state, nodeType);

  return variables.filter(item => item.type === 'boolean');
};

export const getGroupVariablesForNodeType = (state, nodeType) => {
  const variables = getVariableOptionsForNodeType(state, nodeType);

  const categoricalOptions = variables.filter(
    item => item.type === 'categorical',
  );

  return [
    { label: '\u2014 None \u2014', value: '' },
    ...categoricalOptions,
  ];
};

export const getEdgesForNodeType = (state) => {
  const codebook = getCodebook(state);

  return map(codebook.edge, (edge, edgeId) => ({
    label: edge.name,
    color: edge.color,
    value: edgeId,
  }));
};
