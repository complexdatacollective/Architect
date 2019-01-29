/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { get, reduce } from 'lodash';
import { getVariableRegistry } from '../../../../selectors/protocol';

const getNodeType = (_, props) => props.nodeType;

const makeGetVariablesForNodeType = () =>
  createSelector(
    getVariableRegistry,
    getNodeType,
    (variableRegistry, nodeType) => get(variableRegistry, ['node', nodeType, 'variables'], []),
  );

/**
 * Return a list of variable options for the current props.nodeType
 */
const makeGetVariableOptions = () =>
  createSelector(
    makeGetVariablesForNodeType(),
    variables => reduce(
      variables,
      (acc, { type, name }, id) => ([
        ...acc,
        { label: name, value: id, type },
      ]),
      [],
    ),
  );

export {
  makeGetVariableOptions,
};
