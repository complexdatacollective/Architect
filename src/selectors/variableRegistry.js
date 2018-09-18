/* eslint-disable import/prefer-default-export */

import { get, map, reduce, flatMap } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';

const getNodeTypes = state =>
  get(getProtocol(state).variableRegistry, 'node', {});

const getVariablesForNodeType = (state, nodeType) =>
  get(getNodeTypes(state), [nodeType, 'variables'], {});

const getFormTypeUsageIndex = createSelector(
  getProtocol,
  protocol =>
    map(protocol.forms, ({ entity, type }, id) => ({ id, entity, type, parent: 'form' })),
);

const getStagesWithSubject = createSelector(
  getProtocol,
  protocol =>
    protocol.stages.filter(stage => !!stage.subject),
);

const getStageTypeUsageIndex = createSelector(
  getStagesWithSubject,
  stagesWithSubject =>
    map(stagesWithSubject, ({ subject: { entity, type }, id }) => ({ id, entity, type, parent: 'stage' })),
);

const getTypeUsageIndex = createSelector(
  getFormTypeUsageIndex,
  getStageTypeUsageIndex,
  (formTypeIndex, stageTypeIndex) =>
    [...formTypeIndex, ...stageTypeIndex],
);

const getUsageForType = (typeUsageIndex, searchEntity, searchType) =>
  typeUsageIndex.filter(
    ({ type, entity }) =>
      type === searchType && entity === searchEntity,
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

const getTypeUsage = createSelector(
  getTypes,
  getTypeUsageIndex,
  (types, typeUsageIndex) =>
    types.reduce(
      (memo, { entity, type }) => ({
        ...memo,
        [entity]: {
          ...memo[entity],
          [type]: getUsageForType(typeUsageIndex, entity, type),
        },
      }),
      {},
    ),
);


export {
  getNodeTypes,
  getVariablesForNodeType,
  getTypeUsage,
  getTypes,
};
