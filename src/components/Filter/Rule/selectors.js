/* eslint-disable import/prefer-default-export */

import { mapValues, reduce, isEqual } from 'lodash';
import { defaultMemoize, createSelectorCreator } from 'reselect';
import { getVariableRegistry } from '../../../selectors/protocol';

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

const validTypes = [
  'text',
  'number',
  'datetime',
  'boolean',
  'categorical',
  'ordinal',
];

export const getVariableOptions = type =>
  mapValues(
    type,
    meta =>
      reduce(
        meta.variables,
        (memo, variableMeta, variableId) => (
          validTypes.includes(variableMeta.type) ?
            [...memo, [variableId, variableMeta.name]] :
            memo
        ),
        [],
      ),
  );

/**
 * Return a map of variable types:
 *
 * {
 *   node: {
 *     [nodeTypeId]: {
 *       [variableId]: type,
 *       ...
 *     },
 *     ...
 *   },
 * }
 */
export const getVariableTypes = createDeepEqualSelector(
  getVariableRegistry,
  registry =>
    reduce(
      registry,
      (memo, entities, type) => ({
        ...memo,
        [type]: mapValues(
          entities,
          entityMeta => mapValues(entityMeta.variables, 'type'),
        ),
      }),
      {},
    ),
);
