/* eslint-disable import/prefer-default-export */

import { get, map, flatMap, reduce } from 'lodash';
import { getCodebook, getProtocol } from './protocol';
import { getVariableIndex, utils as indexUtils } from './indexes';

// const getProtocolWithDraft = (state, { includeDraft, ...options }) => {
//   const optionsWithDraftDefault = {
//     ...options,
//     includeDraft: isUndefined
// }

const variableProperties = {
  label: 'properties.name',
  value: 'id',
  type: 'properties.type',
};

const entityProperties = {
  label: 'properties.name',
  value: 'subject.type',
  color: 'properties.color',
};

const propertyMaps = {
  variable: variableProperties,
  entity: entityProperties,
};

const asOption = (
  propertyMap = variableProperties,
) =>
  (item) => {
    if (!propertyMap.value) {
      throw Error('option must have a value');
    }

    return reduce(
      propertyMap,
      (memo, path, key) => {
        const v = get(item, path);
        return { ...memo, [key]: v };
      },
      {},
    );
  };

const matchSubject = (entity, type) => (
  type ?
    subject =>
      subject.entity === entity && subject.type === type :
    subject =>
      subject.type === type
);

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
    ...map(nodeTypes, (props, type) => ({ subject: { entity: 'node', type }, properties: props })),
    ...map(edgeTypes, (props, type) => ({ subject: { entity: 'edge', type }, properties: props })),
  ];
};

const getType = (state, { subject, ...options }) => {
  const protocol = getProtocol(state, options);

  const path = subject.type ?
    ['codebook', subject.entity, subject.type] :
    ['codebook', subject.entity];
  const props = get(protocol, path, {});

  if (!props) { return null; }

  return {
    subject,
    properties: props,
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
  const types = options && options.subject ?
    [getType(state, options)] :
    getTypes(state, options);
  const variableIndex = getVariableIndex(protocol);
  const usageSearch = indexUtils.buildSearch([variableIndex]);

  return flatMap(types, ({ subject, properties: typeProperties }) =>
    map(
      typeProperties.variables,
      (props, id) => {
        const inUse = usageSearch.has(id);
        const usage = inUse ?
          indexUtils.getUsage(variableIndex, id) :
          [];

        return {
          id,
          subject,
          properties: props,
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
  matchSubject,
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
  asOption,
  propertyMaps,
};
