import { reduce, get, compact } from 'lodash';
import { getProtocol } from '@selectors/protocol';

const getStageNames = (state) => {
  const protocol = getProtocol(state);
  return protocol.stages
    .map(({ label }) => label);
};

const getStageNameFromPath = (stageNames, path) => {
  const matches = /stages\[([0-9]+)\]/.exec(path);
  const stage = get(matches, 1);
  if (!stage) { return null; }
  return stageNames[stage];
};

export const getUsage = (index, id) =>
  reduce(index, (acc, indexId, path) => {
    if (indexId !== id) { return acc; }
    return [...acc, path];
  }, []);

export const getUsageAsStageName = (state, usage) => {
  const stageNames = getStageNames(state);
  return compact(usage.map(path => getStageNameFromPath(stageNames, path)));
};
