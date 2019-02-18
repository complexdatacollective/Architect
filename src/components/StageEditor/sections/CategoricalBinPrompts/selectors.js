/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { get, reduce } from 'lodash';
import { getCodebook } from '../../../../selectors/protocol';

const getNodeType = (_, props) => props.nodeType;

const makeGetVariablesForNodeType = () =>
  createSelector(
    getCodebook,
    getNodeType,
    (codebook, nodeType) => get(codebook, ['node', nodeType, 'variables'], []),
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
