import { isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';
import collectPaths, { PathCollector, collectMappedPaths } from '../utils/collectPaths';

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

    const displayEdges = collectPaths('stages[].prompts[].edges.display[]', protocol);

    const narrativeEdges = collectPaths('stages[].presets[].edges.display[]', protocol);

    const dyadCensusEdges = collectPaths('stages[].prompts[].createEdge', protocol);

    // TODO: This reducer shouldn't be necessary, look at updating collectPaths
    const mapEdges = ({ type, entity }, path) => {
      if (entity !== 'edge') { return undefined; }
      return [type, `${path}.type`];
    };

    const alterEdgeFormEdges = collectMappedPaths('stages[].subject', protocol, mapEdges);

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

    return collectMappedPaths('stages[].subject', protocol, mapNodes);
  },
);

const variablePathCollector = new PathCollector();

variablePathCollector.add('stages[].quickAdd');
variablePathCollector.add('stages[].form.fields[].variable');
variablePathCollector.add('stages[].panels.filter.rules[].options.attribute');
variablePathCollector.add('stages[].searchOptions.matchProperties[]');
variablePathCollector.add('stages[].cardOptions.additionalProperties[].variable');
variablePathCollector.add('stages[].prompts[].variable');
variablePathCollector.add('stages[].prompts[].edgeVariable');
variablePathCollector.add('stages[].prompts[].otherVariable');
variablePathCollector.add('stages[].prompts[].additionalAttributes[].variable');
variablePathCollector.add('stages[].prompts[].highlight.variable');
variablePathCollector.add('stages[].prompts[].layout.layoutVariable');
variablePathCollector.add('stages[].prompts[].presets[].layoutVariable');
variablePathCollector.add('stages[].prompts[].presets[].groupVariable');
variablePathCollector.add('stages[].prompts[].presets[].edges.display[]');
variablePathCollector.add('stages[].prompts[].presets[].highlight[]');
variablePathCollector.add('stages[].prompts[].bucketSortOrder[].property');
variablePathCollector.add('stages[].prompts[].binSortOrder[].property');
variablePathCollector.add('stages[].skipLogic.filter.rules[].options.attribute');
variablePathCollector.add('stages[].filter.rules[].options.attribute');
variablePathCollector.add('stages[].presets[].layoutVariable');
variablePathCollector.add('stages[].presets[].groupVariable');
variablePathCollector.add('stages[].presets[].edges.display[]');
variablePathCollector.add('stages[].presets[].highlight[]');

/**
 * Returns index of used variables
 * @returns {object} in format: { [path]: variable }
 */
const getVariableIndex = createSelector(
  getProtocol,
  (protocol) => variablePathCollector.collect(protocol),
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

    const informationAssets = collectMappedPaths('stages[].items[]', protocol, mapAssets);
    const nameGeneratorPanels = collectPaths('stages[].panels[].dataSource', protocol);
    const nameGeneratorDataSources = collectPaths('stages[].dataSource', protocol);
    const sociogramBackground = collectPaths('stages[].background.image', protocol);

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
 * e.g. from `collectPaths()` or array of ids
 * @param {Array[paths|Array]} excluded array of path object
 * e.g. from `collectPaths()` or array of ids
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
  collectPaths,
};

export {
  getVariableIndex,
  getAssetIndex,
  getNodeIndex,
  getEdgeIndex,
  utils,
};
