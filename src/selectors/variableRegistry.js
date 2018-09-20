/* eslint-disable import/prefer-default-export */

import { get, map, compact, flatMap, memoize } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';

const getNodeTypes = state =>
  get(getProtocol(state).variableRegistry, 'node', {});

const getVariablesForNodeType = (state, nodeType) =>
  get(getNodeTypes(state), [nodeType, 'variables'], {});

/**
 * Returns "subject" index array for forms, where owner.type === 'form'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getFormTypeUsageIndex = createSelector(
  getProtocol,
  protocol =>
    map(protocol.forms, ({ entity, type }, id) => ({ subject: { entity, type }, owner: { id, type: 'form' } })),
);

/**
 * Returns array of stages that have a subject property
 */
const getStagesWithSubject = createSelector(
  getProtocol,
  protocol =>
    protocol.stages.filter(stage => !!stage.subject),
);

/**
 * Returns "subject" index array for stages, where owner.type === 'stage'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getStageTypeUsageIndex = createSelector(
  getStagesWithSubject,
  stagesWithSubject =>
    map(
      stagesWithSubject,
      ({ subject: { entity, type }, id }) =>
        ({ subject: { entity, type }, owner: { type: 'stage', id } }),
    ),
);

/**
 * Returns flattened prompts (with stageId) from all stages
 * @param {array} stages Stage array
 */
const flattenPromptsFromStages = stages =>
  compact(
    flatMap(
      stages,
      ({ prompts, id: stageId }) =>
        prompts && prompts.map(prompt => ({ ...prompt, stageId })),
    ),
  );

/**
 * Returns array of flattened prompts (with stageId) that have a subject property
 */
const getPromptsWithSubject = createSelector(
  getProtocol,
  protocol =>
    flattenPromptsFromStages(protocol.stages)
      .filter(prompt => !!prompt.subject),
);

/**
 * Returns "subject" index array for prompts, where owner.type === 'prompt'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getPromptTypeUsageIndex = createSelector(
  getPromptsWithSubject,
  promptsWithSubject =>
    map(
      promptsWithSubject,
      ({ subject: { entity, type }, stageId, id: promptId }) =>
        ({ subject: { entity, type }, owner: { type: 'prompt', promptId, stageId } }),
    ),
);

/**
 * Returns "subject" index array for sociogram prompts, where owner.type === 'prompt'
 * @returns {array} in format: [{ subject: { entity, type }, owner: { id, type } }, ...]
 */
const getSociogramTypeUsageIndex = createSelector(
  getProtocol,
  protocol =>
    flatMap(
      flattenPromptsFromStages(protocol.stages.filter(({ type }) => type === 'Sociogram')),
      ({ edges: { creates, display }, stageId, id: promptId }) => ([
        { subject: { entity: 'edge', type: creates }, owner: { type: 'prompt', promptId, stageId } },
        ...display.map(edge => ({ subject: { entity: 'edge', type: edge }, owner: { type: 'prompt', promptId, stageId } })),
      ]),
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
  typeUsageIndex =>
    memoize(
      (searchEntity, searchType) =>
        typeUsageIndex.filter(
          ({ subject: { type, entity } }) =>
            type === searchType && entity === searchEntity,
        ),
      (searchEntity, searchType) => `${searchEntity}:${searchType}`,
    ),
);

const getTypes = createSelector(
  getProtocol,
  protocol =>
    flatMap(
      protocol.variableRegistry,
      (entityTypes, entity) =>
        map(entityTypes, (_, type) => ({ entity, type })),
    ),
);

export {
  getNodeTypes,
  getVariablesForNodeType,
  getTypeUsageIndex,
  getSociogramTypeUsageIndex,
  makeGetUsageForType,
  getTypes,
};
