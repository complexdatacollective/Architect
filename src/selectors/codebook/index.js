/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';
import { getCodebook } from '../protocol';
import { asOptions } from '../utils';
import { makeOptionsWithIsUsed } from './isUsed';

const getNodeTypes = state =>
  get(getCodebook(state), 'node', {});

const getEdgeTypes = state =>
  get(getCodebook(state), 'edge', {});

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
const getVariablesForSubject = (state, subject) =>
  get(getType(state, subject), 'variables', {});

/**
 * Given `subject` return a list of options (`{ label, value, ...}`)
 * for matching entity
 *
 * @param {object} state redux state
 * @param {object} subject subject object in format `{ entity, type }`
 */
const getVariableOptionsForSubject = (state, subject, formNames) => {
  const variables = getVariablesForSubject(state, subject);
  const options = asOptions(variables);
  const optionsWithIsUsed = makeOptionsWithIsUsed(formNames)(state, options);

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
};
