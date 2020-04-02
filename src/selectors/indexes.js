import { isArray, values, reduce } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';
import collectPaths from '../utils/collectPaths';

/**
 * Returns index of used edges (entities)
 * Checks for usage in the following:
 * - `stages[].prompts[].edges.create`
 * - `stages[].prompts[].edges.display[]`
 * - `stages[].presets[].edges.display[]`
 * @returns {object} in format: { [path]: variable }
 */
const getEdgeIndex = createSelector(
  getProtocol,
  (protocol) => {
    const createEdges = collectPaths('stages[].prompts[].edges.create', protocol);
    // TODO: This reducer shouldn't be necessary, look at updating collectPaths
    const displayEdges = reduce(
      collectPaths('stages[].prompts[].edges.display', protocol),
      (memo, edges, path) => ({
        ...memo,
        ...edges.reduce((acc, edge, i) => ({
          ...acc,
          [`${path}[${i}]`]: edge,
        }), {}),
      }),
      {},
    );

    const narrativeEdges = reduce(
      collectPaths('stages[].presets[].edges.display', protocol),
      (memo, edges, path) => ({
        ...memo,
        ...edges.reduce((acc, edge, i) => ({
          ...acc,
          [`${path}[${i}]`]: edge,
        }), {}),
      }),
      {},
    );

    // we only want subject of entity node
    const alterEdgeFormEdges = reduce(
      collectPaths('stages[].subject', protocol),
      (memo, subject, path) => {
        if (subject.entity !== 'edge') {
          return memo;
        }
        return {
          ...memo,
          [`${path}.type`]: subject.type,
        };
      },
      {},
    );

    return {
      ...createEdges,
      ...displayEdges,
      ...narrativeEdges,
      ...alterEdgeFormEdges,
    };
  },
);

/**
 * Returns index of used nodes (entities)
 * Checks for usage in the following:
 * - `stages[].subject`
 * @returns {object} in format: { [path]: variable }
 */
const getNodeIndex = createSelector(
  getProtocol,
  (protocol) => {
    const subjectIndex = collectPaths('stages[].subject', protocol);

    // we only want subject of entity node
    return reduce(
      subjectIndex,
      (memo, subject, path) => {
        if (subject.entity !== 'node') {
          return memo;
        }
        return {
          ...memo,
          [`${path}.type`]: subject.type,
        };
      },
      {},
    );
  },
);

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
    // Generic prompt usage
    const formIndex = collectPaths('stages[].form.fields[].variable', protocol);
    const additionalAttributes = collectPaths('stages[].prompts[].additionalAttributes[].variable', protocol);
    const nameGeneratorIndex = collectPaths('stages[].panels.filter.rules[].options.attribute', protocol);
    const categoricalIndex = {
      ...collectPaths('stages[].prompts[].variable', protocol),
      ...collectPaths('stages[].prompts[].binSortOrder[].property', protocol),
      ...collectPaths('stages[].prompts[].bucketSortOrder[].property', protocol),
    };
    // Sociogram usage
    const sociogramIndex = {
      ...collectPaths('stages[].prompts[].highlight.variable', protocol),
      ...collectPaths('stages[].prompts[].layout.layoutVariable', protocol),
    };
    const narrativeIndex = {
      ...collectPaths('stages[].prompts[].presets[].layoutVariable', protocol),
      ...collectPaths('stages[].prompts[].presets[].groupVariable', protocol),
      ...collectPaths('stages[].prompts[].presets[].edges.display[]', protocol),
      ...collectPaths('stages[].prompts[].presets[].highlight[]', protocol),
    };
    const skipLogicIndex = collectPaths('stages[].skipLogic.filter.rules[].options.attribute', protocol);
    const filterIndex = collectPaths('stages[].filter.rules[].options.attribute', protocol);

    return {
      ...formIndex,
      ...additionalAttributes,
      ...categoricalIndex,
      ...nameGeneratorIndex,
      ...sociogramIndex,
      ...narrativeIndex,
      ...skipLogicIndex,
      ...filterIndex,
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
    const informationItems = reduce(
      collectPaths('stages[].items[]', protocol),
      (acc, { type, content }, index) => {
        if (type === 'text') { return acc; }
        return {
          ...acc,
          [`${index}.content`]: content,
        };
      },
      {},
    );
    const nameGeneratorPanels = collectPaths('stages[].panels[].dataSource', protocol);
    const nameGeneratorDataSources = collectPaths('stages[].dataSource', protocol);
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
  getNodeIndex,
  getEdgeIndex,
  utils,
};
