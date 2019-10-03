/* eslint-disable import/prefer-default-export */

import { get, map, flatMap, pick } from 'lodash';
import { getCodebook, getProtocol } from './protocol';
import { getVariableIndex, utils as indexUtils } from './indexes';

const asOption = extraProperties =>
  ({ properties, id }) => {
    const required = {
      label: properties.name,
      value: id,
    };

    const meta = pick(properties, extraProperties);

    return {
      ...meta,
      ...required,
    };
  };

const asOptions = (items, extraProperties = []) => {
  const getOption = asOption(extraProperties);

  return items.map(getOption);
};

// TODO: add usage?
/**
 * Returns all types
 *
 * @param {object} state redux state
 * @param {object} options getProtocol options `{ includeDraft }`
 */
const getTypes = (state, options) => {
  const protocol = getProtocol(state, options);
  const nodeTypes = get(protocol, 'codebook.node', {});
  const edgeTypes = get(protocol, 'codebook.edge', {});
  const egoProperties = get(protocol, 'codebook.ego', {});

  return [
    { subject: { entity: 'ego' }, properties: egoProperties },
    ...map(nodeTypes, (properties, type) => ({ subject: { entity: 'node', type }, properties })),
    ...map(edgeTypes, (properties, type) => ({ subject: { entity: 'edge', type }, properties })),
  ];
};

const getType = (state, { subject, ...options }) => {
  const protocol = getProtocol(state, options);

  const path = subject.type ?
    ['codebook', subject.entity, subject.type] :
    ['codebook', subject.entity];
  const properties = get(protocol, path, {});

  if (!properties) { return null; }

  return {
    subject,
    properties,
  };
};

/**
 * Returns all variables with meta: usage, and associated subject
 *
 * @param {object} state redux state
 * @param {object} options getProtocol options `{ includeDraft }`
 */
const getVariables = (state, options) => {
  const protocol = getProtocol(state, options);
  const types = getTypes(state, options);
  const variableIndex = getVariableIndex(protocol);
  const usageSearch = indexUtils.buildSearch([variableIndex]);

  return flatMap(types, ({ subject, properties: typeProperties }) =>
    map(
      typeProperties.variables,
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
    ),
  );
};

const getVariable = (state, options) => {
  const variables = getVariables(state, options);

  return variables.find(({ id }) => id === options.id);
};

const getVariableOptions = (state, options) => {
  const variable = getVariable(state, options);

  return get(variable, 'properties.options');
};


const utils = {
  asOption,
  asOptions,
};

export {
  getCodebook,
  getTypes,
  getType,
  // getNodeTypes, // TODO: replace with getTypes
  // getEdgeTypes, // TODO: replace with getTypes
  getVariables,
  getVariable,
  getVariableOptions,
  // getVariablesForSubject, // TODO: replace with getVariables
  // getUnusedVariablesForSubject, // TODO: replace with getVariables
  // getVariableOptionsForSubject, // TODO: replace with getVariables
  // getOptionsForVariable, // TODO: replace with getVariables
  utils,
};
