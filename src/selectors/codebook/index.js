/* eslint-disable import/prefer-default-export */

import { get, find } from 'lodash';
import { getCodebook } from '../protocol';
import { asOptions } from '../utils';
import { makeOptionsWithIsUsed } from './isUsed';

const getNodeTypes = (state) => get(getCodebook(state), 'node', {});

const getEdgeTypes = (state) => get(getCodebook(state), 'edge', {});

const getType = (state, subject) => {
  if (!subject) { return {}; }
  const path = subject.type ? [subject.entity, subject.type] : [subject.entity];

  return get(getCodebook(state), path, {});
};

/**
 * Given `subject` return a list of variables
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getVariablesForSubject = (state, subject) => get(getType(state, subject), 'variables', {});

// Get all variables for all subjects in the codebook
const getAllVariableUUIDs = ({ node: nodeTypes = {}, edge: edgeTypes = {}, ego = {} }) => {
  const variables = new Set();

  // Nodes
  Object.keys(nodeTypes).forEach((nodeType) => {
    const nodeVariables = get(nodeTypes, [nodeType, 'variables'], {});
    Object.keys(nodeVariables).forEach((variable) => {
      variables.add({
        uuid: variable,
        name: nodeVariables[variable].name,
        entity: 'node',
        entityType: nodeType,
        type: nodeVariables[variable].type,
      });
    });
  });

  // Edges
  Object.keys(edgeTypes).forEach((edgeType) => {
    const edgeVariables = get(edgeTypes, [edgeType, 'variables'], {});
    Object.keys(edgeVariables).forEach((variable) => {
      variables.add({
        uuid: variable,
        name: edgeVariables[variable].name,
        entity: 'edge',
        entityType: edgeType,
        type: edgeVariables[variable].type,
      });
    });
  });

  // Ego
  const egoVariables = get(ego, 'variables', {});
  Object.keys(egoVariables).forEach((variable) => {
    variables.add({
      uuid: variable,
      name: egoVariables[variable].name,
      entity: 'ego',
      entityType: null,
      type: egoVariables[variable].type,
    });
  });

  return [...variables]; // Spread converts Set to Array
};

export const makeGetVariableFromUUID = (uuid) => (state) => {
  const codebook = getCodebook(state);
  const variables = getAllVariableUUIDs(codebook);
  const found = find(variables, { uuid });
  return found;
};

/**
 * Given `subject` return a list of options (`{ label, value, ...}`)
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getVariableOptionsForSubject = (state, subject, isUsedOptions = {}) => {
  const variables = getVariablesForSubject(state, subject);
  const options = asOptions(variables);
  const optionsWithIsUsed = makeOptionsWithIsUsed(isUsedOptions)(state, options);

  return optionsWithIsUsed;
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

export {
  getCodebook,
  getNodeTypes,
  getEdgeTypes,
  getType,
  getVariablesForSubject,
  getVariableOptionsForSubject,
  getOptionsForVariable,
  getAllVariableUUIDs,
};
