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


/**
 * Returns index of used assets
 * Checks for usage in the following:
 * - `stages[].prompts[].items[].content`
 * - `stages[].prompts[].panels[].dataSource`
 * - `stages[].prompts[].dataSource`
 * - `stages[].background.image`
 * @returns {object} in format: { [path]: variable }
 */
const getAssetIndex = createSelector(
  getProtocol,
  (protocol) => {
    const informationItems = collectPaths('stages[].items[].content', protocol);
    const nameGeneratorPanels = collectPaths('stages[].prompts[].panels[].dataSource', protocol);
    const nameGeneratorDataSources = collectPaths('stages[].prompts[].dataSource', protocol);
    const sociogramBackground = collectPaths('stages[].background.image', protocol);

    return {
      ...informationItems,
      ...nameGeneratorPanels,
      ...nameGeneratorDataSources,
      ...sociogramBackground,
    };
  },
);

const combineLists = lists =>
  lists
    .map(list => (!isArray(list) ? values(list) : list))
    .reduce((acc, list) => [...acc, ...list], []);

/**
 * Creates a Set of items from arrays or path objects
 * @param {Array[paths|Array]} include array of path object
 * e.g. from `collectPaths()` or array of ids
 * @param {Array[paths|Array]} excluded array of path object
 * e.g. from `collectPaths()` or array of ids
 * @returns {Set} of ids
 */
const buildSearch = (include = [], exclude = []) => {
  const combinedInclude = combineLists(include);
  const combinedExclude = combineLists(exclude);
  const lookup = new Set(combinedInclude);

  combinedExclude.forEach(value => lookup.delete(value));

  return lookup;
};

const utils = {
  buildSearch,
  collectPaths,
};

export {
  getVariableIndex,
  getAssetIndex,
  utils,
};
