import { get, find, isObject } from 'lodash';
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

const getAllVariablesByUUID = (codebook) => {
  if (!codebook) { throw new Error('Codebook not found'); }

  const { node: nodeTypes = null, edge: edgeTypes = null, ego = null } = codebook;
  const flattenedVariables = {};

  const addVariables = (variables) => {
    if (!variables) { return; }
    if (!isObject(variables)) { throw new Error('Variables must be an object'); }

    Object.keys(variables).forEach((variable) => {
      flattenedVariables[variable] = variables[variable];
    });
  };

  if (nodeTypes) {
    Object.values(nodeTypes).forEach(({ variables = null }) => {
      addVariables(variables);
    });
  }

  if (edgeTypes) {
    Object.values(edgeTypes).forEach(({ variables = null }) => {
      addVariables(variables);
    });
  }

  if (ego && ego.variables) {
    addVariables(ego.variables);
  }
  return flattenedVariables;
};

// Get all variables for all subjects in the codebook, adding the entity and type
const getAllVariableUUIDsByEntity = ({ node: nodeTypes = {}, edge: edgeTypes = {}, ego = {} }) => {
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

const makeGetVariableWithEntity = (uuid) => (state) => {
  const codebook = getCodebook(state);
  const variables = getAllVariableUUIDsByEntity(codebook);
  const found = find(variables, { uuid });
  return found;
};

const makeGetVariable = (uuid) => (state) => {
  const codebook = getCodebook(state);
  const variables = getAllVariablesByUUID(codebook);
  const found = get(variables, uuid, null);
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
  getAllVariableUUIDsByEntity,
  getAllVariablesByUUID,
  makeGetVariableWithEntity,
  makeGetVariable,
};
