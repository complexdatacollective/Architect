import {
  reduce, get, compact, uniq, map,
} from 'lodash';
import { getType, getAllVariablesByUUID } from '@selectors/codebook';
import { makeGetIsUsed } from '@selectors/codebook/isUsed';
import { getVariableIndex } from '@selectors/indexes';
import { getProtocol, getCodebook } from '@selectors/protocol';

const getIsUsed = makeGetIsUsed({ formNames: [] });

/**
 * Extract basic stage meta by index from the app state
 * @param {Object} state Application state
 * @returns {Object[]} Stage meta sorted by index in state
 */
export const getStageMetaByIndex = (state) => {
  const protocol = getProtocol(state);
  return protocol.stages
    .map(({ label, id }) => ({ label, id }));
};

export const getVariableMetaByIndex = (state) => {
  const codebook = getCodebook(state);
  const variables = getAllVariablesByUUID(codebook);
  return variables;
};

/**
 * Extract the stage name from a path string
 * @param {string} path {}
 * @returns {string | null} return a stageIndex or null if stage not found.
 */
const getStageIndexFromPath = (path) => {
  const matches = /stages\[([0-9]+)\]/.exec(path);
  return get(matches, 1, null);
};

const codebookVariableReferenceRegex = /codebook\.(ego|node\[([^\]]+)\]|edge\[([^\]]+)\])\.variables\[(.*?)\].validation\.(sameAs|differentFrom)/;

export const getCodebookVariableIndexFromValidationPath = (path) => {
  const match = path.match(codebookVariableReferenceRegex);

  return get(match, 4, null);
};

/**
 * Takes an object in the format of `{[path]: variableID}` and a variableID to
 * search for. Returns an array of paths that match the variableID.
 *
 * @param {Object.<string, string>}} index Usage index in (in format `{[path]: variableID}`)
 * @param {any} value Value to match in usage index
 * @returns {string[]} List of paths ("usage array")
 */
export const getUsage = (index, value) => reduce(index, (acc, indexValue, path) => {
  if (indexValue !== value) { return acc; }
  return [...acc, path];
}, []);

/**
 * Get stage meta (wtf is stage meta, Steve? 🤦) that matches "usage array"
 * (with duplicates removed).
 *
 * See `getUsage()` for how the usage array is generated.
 *
 * Any stages that can't be found in the index are omitted.
 *
 * @param {Object[]} stageMetaByIndex Stage meta by index (as created by `getStageMetaByIndex()`)
 * @param {Object[]} variableMetaByIndex Variable meta by index (as created by
 * `getVariableMetaByIndex()`)
 * @param {string[]} usageArray "Usage array" as created by `getUsage()`
 * @returns {Object[]} List of stage meta `{ label, id }`.
 */
export const getUsageAsStageMeta = (stageMetaByIndex, variableMetaByIndex, usageArray) => {
  // Filter codebook variables from usage array
  const codebookVariablePaths = usageArray.filter(getCodebookVariableIndexFromValidationPath);
  const codebookVariablesWithMeta = codebookVariablePaths.map((path) => {
    const variableId = getCodebookVariableIndexFromValidationPath(path);
    const { name } = variableMetaByIndex[variableId];
    return {
      label: `Used as validation for "${name || 'unknown'}"`,
    };
  });

  const stageIndexes = compact(uniq(usageArray.map(getStageIndexFromPath)));
  const stageVariablesWithMeta = stageIndexes.map(
    (stageIndex) => get(stageMetaByIndex, stageIndex),
  );

  return [
    ...stageVariablesWithMeta,
    ...codebookVariablesWithMeta,
  ];
};

/**
 * Helper function to be used with Array.sort. Sorts a collection of variable
 * definitions by the label property.
 *
 * @param {Object} a { label: string }
 * @param {Object} b { label: string }
 * @returns {number} -1 if a < b, 1 if a > b, 0 if a === b
 */
export const sortByLabel = (a, b) => {
  if (a.label < b.label) { return -1; }
  if (a.label > b.label) { return 1; }
  return 0;
};

/**
 * Returns entity meta data for use in the codebook.
 * @param {*} state
 * @param {*} param1
 * @returns
 */
export const getEntityProperties = (state, { entity, type }) => {
  const {
    name,
    color,
    variables,
  } = getType(state, { entity, type });

  const variableIndex = getVariableIndex(state);
  const variableMeta = getVariableMetaByIndex(state);
  const stageMetaByIndex = getStageMetaByIndex(state);
  const isUsedIndex = getIsUsed(state);

  const variablesWithUsage = map(
    variables,
    (variable, id) => {
      const inUse = get(isUsedIndex, id, false);

      const baseProperties = {
        ...variable,
        id,
        inUse,
      };

      if (!inUse) {
        return (baseProperties);
      }

      const usage = getUsageAsStageMeta(
        stageMetaByIndex,
        variableMeta,
        getUsage(variableIndex, id),
      ).sort(sortByLabel);

      const usageString = usage.map(({ label }) => label).join(', ').toUpperCase();
      return ({
        ...baseProperties,
        usage,
        usageString,
      });
    },
  );

  return {
    name,
    color,
    variables: variablesWithUsage,
  };
};
