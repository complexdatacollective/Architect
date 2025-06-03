import { isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';
import collectPath, { collectPaths } from '../utils/collectPaths';

const mapSubject = (entityType) => ({ type, entity }, path) => {
  if (entity !== entityType) { return undefined; }
  return [type, `${path}.type`];
};

const mapAssetItems = ({ type, content }, path) => {
  if (type === 'text') { return undefined; }
  return [content, `${path}.content`];
};

/**
 * Master list of paths where variables are used.
 *
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 * It is VITAL that this be updated when any new variable use occurs in the
 * protocol schema!
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 *
 */
export const paths = {
  edges: [
    'stages[].prompts[].edges.create',
    'stages[].prompts[].edges.display[]',
    'stages[].presets[].edges.display[]',
    'stages[].prompts[].createEdge',
    ['stages[].subject', mapSubject('edge')],
  ],
  nodes: [
    ['stages[].subject', mapSubject('node')],
  ],
  variables: [
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
    // `sameAs` and `differentFrom` are variable references in these locations
    'codebook.ego.variables[].validation.sameAs',
    'codebook.ego.variables[].validation.differentFrom',
    'codebook.node[].variables[].validation.sameAs',
    'codebook.node[].variables[].validation.differentFrom',
    'codebook.edge[].variables[].validation.sameAs',
    'codebook.edge[].variables[].validation.differentFrom',
  ],
  assets: [
    'stages[].panels[].dataSource',
    'stages[].dataSource',
    'stages[].background.image',
    'stages[].mapOptions.tokenAssetId',
    'stages[].mapOptions.dataSourceAssetId',
    ['stages[].items[]', mapAssetItems],
  ],
};

/**
 * Returns index of used edges (entities)
 * @returns {object} in format: { [path]: variable }
 */
const getEdgeIndex = createSelector(
  getProtocol,
  (protocol) => collectPaths(paths.edges, protocol),
);

/**
 * Returns index of used nodes (entities)
 * @returns {object} in format: { [path]: variable }
 */
const getNodeIndex = createSelector(
  getProtocol,
  (protocol) => collectPaths(paths.nodes, protocol),
);

/**
 * Returns index of used variables
 * @returns {object} in format: { [path]: variable }
 */
const getVariableIndex = createSelector(
  getProtocol,
  (protocol) => collectPaths(paths.variables, protocol),
);

/**
 * Returns index of used assets
 * @returns {object} in format: { [path]: variable }
 */
const getAssetIndex = createSelector(
  getProtocol,
  (protocol) => collectPaths(paths.assets, protocol),
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
  collectPaths,
};

export {
  getVariableIndex,
  getAssetIndex,
  getNodeIndex,
  getEdgeIndex,
  utils,
};
