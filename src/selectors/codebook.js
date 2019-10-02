/* eslint-disable import/prefer-default-export */

import { get, map, flatMap, has, filter, pickBy } from 'lodash';
import { getCodebook, getProtocol } from './protocol';
import { getVariableIndex, utils as indexUtils } from './indexes';

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

const getTypes = (protocol) => {
  const nodeTypes = get(protocol, 'codebook.node', {});
  const edgeTypes = get(protocol, 'codebook.edge', {});

  return [
    { entity: 'ego' },
    ...map(nodeTypes, (_, type) => ({ entity: 'node', type })),
    ...map(edgeTypes, (_, type) => ({ entity: 'edge', type })),
  ];
};

const getType = (protocol, subject) => {
  if (!subject) { return {}; }

  const path = subject.type ?
    ['codebook', subject.entity, subject.type] :
    ['codebook', subject.entity];
  return get(protocol, path, {});
};

const getNodeTypes = (state) => {
  const protocol = getProtocol(state);

  return get(protocol, 'codebook.node', {});
};

const getEdgeTypes = (state) => {
  const protocol = getProtocol(state);

  return get(protocol, 'codebook.edge', {});
};

/**
 * Returns all variables with meta: usage, and associated subject
 *
 * @param {object} state redux state
 * @param {object} options getProtocol options `{ includeDraft }`
 */
const getVariables = (state, options) => {
  const protocol = getProtocol(state, options);
  const types = getTypes(protocol);
  const variableIndex = getVariableIndex(protocol);
  const usageSearch = indexUtils.buildSearch([variableIndex]);

  return flatMap(types, (subject) => {
    const type = getType(protocol, subject);

    return map(
      type.variables,
      (properties, id) => {
        const inUse = usageSearch.has(id);
        const usage = inUse ?
          indexUtils.getUsage(variableIndex, id) :
          [];

        return {
          id,
          subject,
          properties,
          inUse,
          usage,
        };
      },
    );
  });
};

/**
 * Given `subject` return a list of variables
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getVariablesForSubject = (state, subject) => {
  const protocol = getProtocol(state);
  return get(getType(protocol, subject), 'variables', {});
};

/**
 * Given `subject` return a list of unused variables
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getUnusedVariablesForSubject = (state, subject) => {
  const variableIndex = getVariableIndex(state);
  const protocol = getProtocol(state);
  const variablesForSubject = getVariablesForSubject(protocol, subject);

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
  getNodeTypes, // TODO: replace with getTypes
  getEdgeTypes, // TODO: replace with getTypes
  getVariables,
  getVariablesForSubject, // TODO: replace with getVariables
  getUnusedVariablesForSubject, // TODO: replace with getVariables
  getVariableOptionsForSubject, // TODO: replace with getVariables
  getOptionsForVariable,
  utils,
};
