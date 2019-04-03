/* eslint-disable import/prefer-default-export */

import { get, reduce, isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';

const getLookup = index => new Set(values(index));

/**
 * Usage comes from:
 * - prompts[].variable
 * - prompts[].form.fields[].variable
 * - prompts[].highlight.variable
 */

const collectPaths = (paths, obj, memoPath) => {
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
 * @returns {object} in format: { [path]: variable }
 */
const getVariableIndex = createSelector(
  getProtocol,
  (protocol) => {
    const formIndex = collectPaths('stages[].prompts[].form.fields[].variable', protocol);
    const sociogramIndex = collectPaths('stages[].prompts[].highlight.variable', protocol);

    return {
      ...formIndex,
      ...sociogramIndex,
    };
  },
);

const utils = {
  getLookup,
};

export {
  getVariableIndex,
  utils,
};
