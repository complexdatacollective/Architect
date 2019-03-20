import { get, map, reduce } from 'lodash';
import { getCodebook } from '../../../selectors/protocol';

const asOption = (value, key) =>
  ({
    label: get(value, 'name', ''),
    value: key,
    color: get(value, 'color', ''),
  });

const filterAsOption = rule =>
  (memo, item, id) => {
    if (!rule(item)) { return memo; }
    return [
      ...memo,
      asOption(item, id),
    ];
  };

export const getVariablesForNodeType = (state, props) => {
  const nodeType = props.nodeType;
  const codebook = getCodebook(state);
  return get(codebook, ['node', nodeType, 'variables'], {});
};

export const getLayoutVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  const layoutVariables = reduce(
    variables,
    filterAsOption(item => item.type === 'layout'),
    [],
  );

  return layoutVariables;
};

export const getHighlightVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  const highlightVariables = reduce(
    variables,
    filterAsOption(item => item.type === 'boolean'),
    [],
  );

  return highlightVariables;
};

export const getEdgesForNodeType = (state) => {
  const codebook = getCodebook(state);

  return map(codebook.edge, asOption);
};
