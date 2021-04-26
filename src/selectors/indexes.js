import { isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';
import collectPath, { collectPaths, collectMappedPath } from '../utils/collectPaths';

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
    const createEdges = collectPath('stages[].prompts[].edges.create', protocol);

    const displayEdges = collectPath('stages[].prompts[].edges.display[]', protocol);

    const narrativeEdges = collectPath('stages[].presets[].edges.display[]', protocol);

    const dyadCensusEdges = collectPath('stages[].prompts[].createEdge', protocol);

    // TODO: This reducer shouldn't be necessary, look at updating collectPath
    const mapEdges = ({ type, entity }, path) => {
      if (entity !== 'edge') { return undefined; }
      return [type, `${path}.type`];
    };

    const alterEdgeFormEdges = collectMappedPath('stages[].subject', protocol, mapEdges);

    return {
      ...createEdges,
      ...displayEdges,
      ...narrativeEdges,
      ...dyadCensusEdges,
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
    const mapNodes = ({ type, entity }, path) => {
      if (entity !== 'node') { return undefined; }
      return [type, `${path}.type`];
    };

    return collectMappedPath('stages[].subject', protocol, mapNodes);
  },
);

const variablePaths = [
  'stages[].quickAdd',
  'stages[].form.fields[].variable',
  'stages[].panels.filter.rules[].options.attribute',
  'stages[].searchOptions.matchProperties[]',
  'stages[].cardOptions.additionalProperties[].variable',
  'stages[].prompts[].variable',
  'stages[].prompts[].edgeVariable',
  'stages[].prompts[].otherVariable',
  'stages[].prompts[].additionalAttributes[].variable',
  'stages[].prompts[].highlight.variable',
  'stages[].prompts[].layout.layoutVariable',
  'stages[].prompts[].presets[].layoutVariable',
  'stages[].prompts[].presets[].groupVariable',
  'stages[].prompts[].presets[].edges.display[]',
  'stages[].prompts[].presets[].highlight[]',
  'stages[].prompts[].bucketSortOrder[].property',
  'stages[].prompts[].binSortOrder[].property',
  'stages[].skipLogic.filter.rules[].options.attribute',
  'stages[].filter.rules[].options.attribute',
  'stages[].presets[].layoutVariable',
  'stages[].presets[].groupVariable',
  'stages[].presets[].edges.display[]',
  'stages[].presets[].highlight[]',
];

/**
 * Returns index of used variables
 * @returns {object} in format: { [path]: variable }
 */
const getVariableIndex = createSelector(
  getProtocol,
  (protocol) => collectPaths(variablePaths, protocol),
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
    const mapAssets = ({ type, content }, path) => {
      if (type === 'text') { return undefined; }
      return [content, `${path}.content`];
    };

    const informationAssets = collectMappedPath('stages[].items[]', protocol, mapAssets);
    const nameGeneratorPanels = collectPath('stages[].panels[].dataSource', protocol);
    const nameGeneratorDataSources = collectPath('stages[].dataSource', protocol);
    const sociogramBackground = collectPath('stages[].background.image', protocol);

    return {
      ...informationAssets,
      ...nameGeneratorPanels,
      ...nameGeneratorDataSources,
      ...sociogramBackground,
    };
  },
);

const combineLists = (lists) => lists
  .map((list) => (!isArray(list) ? values(list) : list))
  .reduce((acc, list) => [...acc, ...list], []);

/**
 * Creates a Set of items from arrays or path objects
 * @param {Array[paths|Array]} include array of path object
 * e.g. from `collectPath()` or array of ids
 * @param {Array[paths|Array]} excluded array of path object
 * e.g. from `collectPath()` or array of ids
 * @returns {Set} of ids
 */
const buildSearch = (include = [], exclude = []) => {
  const combinedInclude = combineLists(include);
  const combinedExclude = combineLists(exclude);
  const lookup = new Set(combinedInclude);

  combinedExclude.forEach((value) => lookup.delete(value));

  return lookup;
};

const utils = {
  buildSearch,
  collectPath,
};

export {
  getVariableIndex,
  getAssetIndex,
  getNodeIndex,
  getEdgeIndex,
  utils,
};
