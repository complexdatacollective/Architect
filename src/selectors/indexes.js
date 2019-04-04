/* eslint-disable import/prefer-default-export */

import { get, reduce, isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';

/**
 * Collect nodes that match path from `obj`
 *
 * Example usage:
 *
 * ```
 * const myObject = {
 *   stages: [
 *     {
 *       prompts: [
 *         { variable: 'foo' },
 *         { variable: 'bar' },
 *       ]
 *     },
 *     {
 *       prompts: [
 *         { variable: 'bazz' },
 *       ]
 *     },
 *   ]
 * };
 *
 * const paths = collectPaths('stages[].prompts[].variable', myObject);
 * // result:
 * // paths = {
 * //   'stages[0].prompts[0].variable': 'foo',
 * //   'stages[0].prompts[1].variable': 'bar',
 * //   'stages[1].prompts[0].variable': 'bazz',
 * // };
 * ```
 *
 * @returns {object} in format: { [path]: node }
 */
const collectPaths = (paths, obj, memoPath) => {
  // We expect a string notation for paths, but it's actually converted to array automatically:
  // 'stages[].prompts[].subject.type' => ['stages', 'prompts', 'subject.type']
  const [next, ...rest] = isArray(paths) ?
    paths :
    paths.split('[].');

  const path = memoPath ?
    `${memoPath}.${next}` : `${next}`;

  const nextObj = get(obj, next);

  if (rest.length > 0) {
    return reduce(
      nextObj || [],
      (memo, item, index) => ({
        ...memo,
        ...collectPaths(rest, item, `${path}[${index}]`),
      }),
      {},
    );
  }

  if (nextObj) {
    return {
      [path]: nextObj,
    };
  }

  return {};
};


/**
 * Creates a set of variable ids from a path object
 * @param {string} paths path object, e.g. from `collectPaths()`
 * @returns {Set} of variable Ids
 */
const getLookup = paths => new Set(values(paths));

/**
 * Returns index of used variables
 * Checks for usage in the following:
 * - `prompts[].variable`
 * - `prompts[].form.fields[].variable`
 * - `prompts[].highlight.variable`
 * @returns {object} in format: { [path]: variable }
 */
const getVariableIndex = createSelector(
  getProtocol,
  (protocol) => {
    const formIndex = collectPaths('stages[].prompts[].form.fields[].variable', protocol);
    const sociogramIndex = collectPaths('stages[].prompts[].highlight.variable', protocol);
    const variableIndex = collectPaths('stages[].prompts[].variable', protocol);

    return {
      ...formIndex,
      ...sociogramIndex,
      ...variableIndex,
    };
  },
);

const utils = {
  getLookup,
  collectPaths,
};

export {
  getVariableIndex,
  utils,
};
