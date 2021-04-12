import {
  map, compact, flatMap, uniqBy, memoize,
} from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';

/**
 * Returns "subject" index array for forms, where owner.type === 'form'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getFormTypeUsageIndex = createSelector(
  getProtocol,
  (protocol) => map(protocol.forms, ({ entity, type }, id) => ({ subject: { entity, type }, owner: { id, type: 'form' } })),
);

/**
 * Returns array of stages that have a subject property
 */
const getStagesWithSubject = createSelector(
  getProtocol,
  (protocol) => protocol.stages.filter((stage) => !!stage.subject),
);

/**
 * Returns "subject" index array for stages, where owner.type === 'stage'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getStageTypeUsageIndex = createSelector(
  getStagesWithSubject,
  (stagesWithSubject) => map(
    stagesWithSubject,
    ({ subject: { entity, type }, id }) => ({ subject: { entity, type }, owner: { type: 'stage', id } }),
  ),
);

/**
 * Returns flattened prompts (with stageId) from all stages
 * @param {array} stages Stage array
 */
const flattenPromptsFromStages = (stages) => compact(
  flatMap(
    stages,
    ({ prompts, id: stageId }) => prompts && prompts.map((prompt) => ({ ...prompt, stageId })),
  ),
);

/**
 * Returns array of flattened prompts (with stageId) that have a subject property
 */
const getPromptsWithSubject = createSelector(
  getProtocol,
  (protocol) => flattenPromptsFromStages(protocol.stages)
    .filter((prompt) => !!prompt.subject),
);

/**
 * Returns "subject" index array for prompts, where owner.type === 'prompt'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getPromptTypeUsageIndex = createSelector(
  getPromptsWithSubject,
  (promptsWithSubject) => map(
    promptsWithSubject,
    ({ subject: { entity, type }, stageId, id: promptId }) => ({ subject: { entity, type }, owner: { type: 'prompt', promptId, stageId } }),
  ),
);

/**
 * Returns "subject" index array for sociogram prompts, where owner.type === 'prompt'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getSociogramTypeUsageIndex = createSelector(
  getProtocol,
  (protocol) => flatMap(
    flattenPromptsFromStages(protocol.stages.filter(({ type }) => type === 'Sociogram')),
    ({ stageId, id: promptId, ...prompt }) => {
      if (!prompt.edges) { return []; }

      const { display, creates } = prompt.edges;
      let usage = [];

      if (creates) {
        usage = usage.concat({ subject: { entity: 'edge', type: creates }, owner: { type: 'prompt', promptId, stageId } });
      }
      if (display) {
        usage = usage.concat(
          display.map((edge) => ({ subject: { entity: 'edge', type: edge }, owner: { type: 'prompt', promptId, stageId } })),
        );
      }

      return usage;
    },
  ),
);

/**
 * Returns a combined "subject" index array for forms, stages and prompts
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getTypeUsageIndex = createSelector(
  getFormTypeUsageIndex,
  getStageTypeUsageIndex,
  getPromptTypeUsageIndex,
  getSociogramTypeUsageIndex,
  (
    formTypeUsageIndex,
    stageTypeUsageIndex,
    promptTypeUsageIndex,
    sociogramTypeUsageIndex,
  ) => [
    ...formTypeUsageIndex,
    ...stageTypeUsageIndex,
    ...promptTypeUsageIndex,
    ...sociogramTypeUsageIndex,
  ],
);

/**
 * Returns a getter method which filters the typeUsageIndex for a specific "subject"
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const makeGetUsageForType = createSelector(
  getTypeUsageIndex,
  (typeUsageIndex) => memoize(
    (searchEntity, searchType) => typeUsageIndex.filter(
      ({ subject: { type, entity } }) => type === searchType && entity === searchEntity,
    ),
    (searchEntity, searchType) => `${searchEntity}:${searchType}`,
  ),
);

/**
 * Counts each unique promptId stageId pair, grouped by stageId
 * @returns {object} { [stageId]: count, ... }
 */
const perStagePromptCountFromUsage = (usage) => {
  const prompts = [];

  return usage.reduce(
    (memo, { owner }) => {
      if (owner.type !== 'prompt' || prompts.includes(owner.promptId)) { return memo; }

      return { ...memo, [owner.stageId]: (memo[owner.stageId] ? memo[owner.stageId] + 1 : 1) };
    },
    {},
  );
};

/**
 * Calcuates delete impact of removing type, including removing stages when prompts are emptied
 * @returns {array} in format: [{ type, (id | stageId, promptId )}]
 */
const makeGetDeleteImpact = createSelector(
  getProtocol,
  makeGetUsageForType,
  (protocol, getUsageForType) => memoize(
    (searchEntity, searchType) => {
      const usage = getUsageForType(searchEntity, searchType);

      const perStagePromptCount = perStagePromptCountFromUsage(usage);

      const additionallyDeletedStageIds = protocol.stages
        .reduce((memo, { id, prompts }) => {
          if (!prompts || prompts.length !== perStagePromptCount[id]) { return memo; }
          return [
            ...memo,
            id,
          ];
        }, []);

      const deletedObjects = uniqBy(
        usage
          .map(({ owner }) => {
            if (
              owner.type === 'prompt'
                && additionallyDeletedStageIds.includes(owner.stageId)
            ) {
              return { id: owner.stageId, type: 'stage' };
            }

            return owner;
          }),
        ({ type, ...owner }) => (owner.id ? `${owner.id}:${type}` : `${owner.stageId}:${owner.promptId}:${type}`),
      );

      return deletedObjects;
    },
    (searchEntity, searchType) => `${searchEntity}:${searchType}`,
  ),
);

/**
 * Returns a flat list of all nodes and edges in protocol
 * @returns {array} in format: [{ entity, type }, ...]
 */
const getTypes = createSelector(
  getProtocol,
  (protocol) => flatMap(
    protocol.codebook,
    (entityTypes, entity) => map(entityTypes, (_, type) => ({ entity, type })),
  ),
);

const makeGetObjectLabel = createSelector(
  getProtocol,
  (protocol) => memoize(
    (protocolObject) => {
      switch (protocolObject.type) {
        case 'form':
          return protocol.forms[protocolObject.id].title;
        case 'stage':
          return protocol.stages.find(({ id }) => id === protocolObject.id).label;
        case 'prompt': {
          const stageLabel = protocol.stages.find(({ id }) => id === protocolObject.stageId).label;
          const promptLabel = protocol.stages
            .find(({ id }) => id === protocolObject.stageId).prompts
            .find(({ id }) => id === protocolObject.promptId).text;
          return `${stageLabel} -> ${promptLabel}`;
        }
        default:
          return '';
      }
    },
    (protocolObject) => `${protocolObject.type}: ${
      protocolObject.type === 'prompt'
        ? `${protocolObject.stageId}:${protocolObject.promptId}`
        : protocolObject.id
    }`,
  ),
);

export {
  getTypeUsageIndex,
  getSociogramTypeUsageIndex,
  makeGetUsageForType,
  makeGetDeleteImpact,
  makeGetObjectLabel,
  getTypes,
};
