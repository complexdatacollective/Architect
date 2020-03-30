/* eslint-disable import/prefer-default-export */

import { get, map, has, filter, pickBy } from 'lodash';
import { createSelector } from 'reselect';
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

export const getNodeTypeOptions = createSelector(
  getNodeTypes,
  nodeTypes => asOptions(nodeTypes),
);

/**
 * Given `subject` return a list of variables
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getVariablesForSubject = (state, subject) =>
  get(getType(state, subject), 'variables', {});

/**
 * Given `subject` return a list of unused variables
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getUnusedVariablesForSubject = (state, subject) => {
  const variableIndex = getVariableIndex(state);
  const variablesForSubject = getVariablesForSubject(state, subject);

  const unusedVariables = filter(
    variablesForSubject,
    (_, variableId) => !has(variableIndex, variableId),
  );

  return unusedVariables;
};

/**
 * Given `subject` return a list of options (`{ label, value, ...}`)
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getVariableOptionsForSubject = (state, subject) => {
  const variables = getVariablesForSubject(state, subject);
  const options = asOptions(variables);

  return options;
};

/**
 * Given { entity, type, variable } return options for the
 * matching variable e.g. `state.node.person.variables.closeness.options`
 *
 * @param {object} state redux state
 * @param {object} references references to variable
 */
const getOptionsForVariable = (state, { entity, type, variable }) => {
  const variables = getVariablesForSubject(state, { entity, type });

  return get(variables, [variable, 'options'], []);
};

const utils = {
  asOption,
  asOptions,
};

export {
  getCodebook,
  getNodeTypes,
  getEdgeTypes,
  getType,
  getVariablesForSubject,
  getUnusedVariablesForSubject,
  getVariableOptionsForSubject,
  getOptionsForVariable,
  utils,
};
