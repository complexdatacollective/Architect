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

const getEdgeTypes = state =>
  get(getCodebook(state), 'edge', {});

const getType = (state, subject) => {
  if (!subject) { return {}; }

  const path = subject.type ? [subject.entity, subject.type] : [subject.entity];

  return get(getCodebook(state), path, {});
};

const getVariablesForSubject = (state, subject) =>
  get(getType(state, subject), 'variables', {});

const getUnusedVariablesForSubject = (state, subject) => {
  const variableIndex = getVariableIndex(state);
  const variablesForSubject = getVariablesForSubject(state, subject);

  const unusedVariables = filter(
    variablesForSubject,
    (_, variableId) => !has(variableIndex, variableId),
  );

  return unusedVariables;
};

const getVariableOptionsForSubject = (state, subject) => {
  const variables = getVariablesForSubject(state, subject);
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
  getEdgeTypes,
  getVariablesForSubject,
  getUnusedVariablesForSubject,
  getVariableOptionsForSubject,
  utils,
};
