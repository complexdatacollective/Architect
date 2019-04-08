/* eslint-disable import/prefer-default-export */

import { get, map, has, filter, pickBy } from 'lodash';
import { getCodebook } from './protocol';
import { getVariableIndex } from './indexes';

const extraProperties = new Set(['type', 'color']);

const asOption = (item, id) => {
  const required = {
    label: item.name,
    value: id,
  };
  const extra = pickBy(
    item,
    (value, key) => value && extraProperties.has(key),
  );
  return {
    ...extra,
    ...required,
  };
};

const asOptions = items =>
  map(
    items,
    asOption,
  );

const getNodeTypes = state =>
  get(getCodebook(state), 'node', {});

const getVariablesForNodeType = (state, nodeType) =>
  get(getNodeTypes(state), [nodeType, 'variables'], {});

const getUnusedVariablesForNodeType = (state, nodeType) => {
  const variableIndex = getVariableIndex(state);
  const variablesForNodeType = getVariablesForNodeType(state, nodeType);

  const unusedVariables = filter(
    variablesForNodeType,
    (_, variableId) => !has(variableIndex, variableId),
  );

  return unusedVariables;
};

const getVariableOptionsForNodeType = (state, nodeType) => {
  const variables = getVariablesForNodeType(state, nodeType);
  const options = asOptions(variables);

  return options;
};

const utils = {
  asOption,
  asOptions,
};

export {
  getCodebook,
  getNodeTypes,
  getVariablesForNodeType,
  getUnusedVariablesForNodeType,
  getVariableOptionsForNodeType,
  utils,
};
