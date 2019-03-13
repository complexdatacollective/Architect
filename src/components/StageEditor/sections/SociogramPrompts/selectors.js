import { get, map, reduce } from 'lodash';
import { getVariableRegistry } from '../../../../selectors/protocol';

const asOption = (value, key) =>
  ({
    label: get(value, 'label', ''),
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
  const variableRegistry = getVariableRegistry(state);
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

export const getLayoutVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  return reduce(
    variables,
    filterAsOption(item => item.type === 'layout'),
    [],
  );
};

export const getHighlightVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  return reduce(
    variables,
    filterAsOption(item => item.type === 'boolean'),
    [],
  );
};

export const getEdgesForNodeType = (state) => {
  const variableRegistry = getVariableRegistry(state);

  return map(variableRegistry.edge, asOption);
};
