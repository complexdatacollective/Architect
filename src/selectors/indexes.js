import { isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';
import collectPaths from '../utils/collectPaths';

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
  utils,
};
