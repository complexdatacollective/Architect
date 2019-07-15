import uuid from 'uuid';
import { omit, get, has, isEmpty } from 'lodash';
import { getCodebook, getVariablesForSubject } from '../../../selectors/codebook';
import { makeGetUsageForType } from '../../../selectors/usage';
import { getVariableIndex, utils as indexUtils } from '../../../selectors/indexes';
import { getNextCategoryColor } from './utils/helpers';
import safeName from '../../../utils/safeName';
import { actionCreators as stageActions } from './stages';

const UPDATE_TYPE = 'PROTOCOL/UPDATE_TYPE';
const CREATE_TYPE = 'PROTOCOL/CREATE_TYPE';
const DELETE_TYPE = 'PROTOCOL/DELETE_TYPE';
const UPDATE_VARIABLE = 'PROTOCOL/UPDATE_VARIABLE';
const CREATE_VARIABLE = 'PROTOCOL/CREATE_VARIABLE';
const DELETE_VARIABLE = 'PROTOCOL/DELETE_VARIABLE';

const initialState = {
  edge: {},
  node: {},
};

const defaultTypeTemplate = {
  color: '',
  variables: {},
};

const createType = (entity, type, configuration) => ({
  type: CREATE_TYPE,
  meta: {
    type,
    entity,
  },
  configuration: {
    ...defaultTypeTemplate,
    ...configuration,
  },
});

const updateType = (entity, type, configuration) => ({
  type: UPDATE_TYPE,
  meta: {
    entity,
    type,
  },
  configuration,
});

const deleteType = (entity, type) => ({
  type: DELETE_TYPE,
  meta: {
    entity,
    type,
  },
});

const createVariable = (entity, type, variable, configuration) => ({
  type: CREATE_VARIABLE,
  meta: {
    type,
    entity,
    variable,
  },
  configuration,
});

const updateVariable = (entity, type, variable, configuration, merge = false) => ({
  type: UPDATE_VARIABLE,
  meta: {
    entity,
    type,
    variable,
  },
  configuration,
  merge,
});

const deleteVariable = (entity, type, variable) => ({
  type: DELETE_VARIABLE,
  meta: {
    type,
    entity,
    variable,
  },
});

const createTypeThunk = (entity, configuration) =>
  (dispatch) => {
    const type = uuid();

    dispatch(createType(entity, type, configuration));

    return {
      type,
      entity,
    };
  };

const createEdgeThunk = configuration =>
  (dispatch, getState) => {
    const entity = 'edge';
    const state = getState();
    const protocol = state.protocol.present;
    const color = configuration.color || getNextCategoryColor(protocol, entity);
    const type = uuid();

    dispatch(createType(entity, type, { ...configuration, color }));

    return {
      type,
      entity,
    };
  };

const createVariableThunk = (entity, type, configuration) =>
  (dispatch, getState) => {
    if (!configuration.name) {
      throw new Error('Cannot create a new variable without a name');
    }

    if (!configuration.type) {
      throw new Error('Cannot create a new variable without a type');
    }

    const safeConfiguration = {
      ...configuration,
      name: safeName(configuration.name),
    };

    if (isEmpty(safeConfiguration.name)) {
      throw new Error('Variable name contains no valid characters');
    }

    const variables = getVariablesForSubject(getState(), { entity, type });
    const variableNameExists = Object.values(variables)
      .some(({ name }) => name === safeConfiguration.name);

    // We can't use same variable name twice.
    if (variableNameExists) {
      throw new Error(`Variable with name "${safeConfiguration.name}" already exists`);
    }

    const variable = uuid();

    dispatch(createVariable(entity, type, variable, safeConfiguration));

    return {
      entity,
      type,
      variable,
    };
  };

const updateVariableThunk = (entity, type, variable, configuration, merge = false) =>
  (dispatch, getState) => {
    const state = getState();
    const variableExists = has(getVariablesForSubject(state, { entity, type }), variable);

    if (!variableExists) {
      throw new Error(`Variable "${variable}" does not exist`);
    }

    dispatch(updateVariable(entity, type, variable, configuration, merge));
  };

const deleteVariableThunk = (entity, type, variable) =>
  (dispatch, getState) => {
    const variableSearch = indexUtils.buildSearch([getVariableIndex(getState())]);
    if (variableSearch.has(variable)) { return false; }
    dispatch(deleteVariable(entity, type, variable));
    return true;
  };

const updateDisplayVariableThunk = (entity, type, variable) =>
  (dispatch, getState) => {
    const codebook = getCodebook(getState());

    const previousConfiguration = get(codebook, [entity, type], {});

    const updatedConfiguration = {
      ...previousConfiguration,
      displayVariable: variable,
    };

    dispatch(updateType(entity, type, updatedConfiguration));
  };

const getDeleteAction = ({ type, ...owner }) => {
  switch (type) {
    case 'stage':
      return stageActions.deleteStage(owner.id);
    case 'prompt':
      return stageActions.deletePrompt(owner.stageId, owner.promptId, true);
    default:
      // noop
      return {};
  }
};

const deleteTypeThunk = (entity, type, deleteRelatedObjects = false) =>
  (dispatch, getState) => {
    dispatch(deleteType(entity, type));

    if (!deleteRelatedObjects) { return; }

    // check usage elsewhere, and delete related stages/forms
    const getUsageForType = makeGetUsageForType(getState());
    const usageForType = getUsageForType(entity, type);

    usageForType
      .map(({ owner }) => getDeleteAction(owner))
      .forEach(dispatch);
  };

/**
 * Reducer helpers
 */

const getStateWithUpdatedType = (state, entity, type, configuration) => {
  if (entity !== 'ego' && !type) { throw Error('Type must be specified for non ego nodes'); }

  const entityConfiguration = entity === 'ego' ?
    configuration :
    {
      ...state[entity],
      [type]: configuration,
    };

  return {
    ...state,
    [entity]: entityConfiguration,
  };
};

const getStateWithUpdatedVariable = (
  state,
  entity,
  type,
  variable,
  configuration,
  merge = false,
) => {
  if (entity !== 'ego' && !type) { throw Error('Type must be specified for non ego nodes'); }

  const entityPath = entity === 'ego' ?
    [entity] :
    [entity, type];

  const variableConfiguration = merge ?
    {
      ...get(state, [...entityPath, 'variables', variable], {}),
      ...configuration,
    } :
    configuration;

  const newVariables = {
    ...get(state, [...entityPath, 'variables'], {}),
    [variable]: variableConfiguration,
  };

  const typeConfiguration = get(state, entityPath, {});

  return getStateWithUpdatedType(state, entity, type, {
    ...typeConfiguration,
    variables: newVariables,
  });
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_TYPE:
    case UPDATE_TYPE:
      return getStateWithUpdatedType(
        state,
        action.meta.entity,
        action.meta.type,
        action.configuration,
      );
    case DELETE_TYPE:
      if (action.meta.entity === 'ego') { return state; }
      return {
        ...state,
        [action.meta.entity]: {
          ...omit(state[action.meta.entity], action.meta.type),
        },
      };
    case CREATE_VARIABLE:
    case UPDATE_VARIABLE:
      return getStateWithUpdatedVariable(
        state,
        action.meta.entity,
        action.meta.type,
        action.meta.variable,
        action.configuration,
        action.merge,
      );
    case DELETE_VARIABLE: {
      const variablePath = action.meta.entity !== 'ego' ?
        `${action.meta.type}.variables.${action.meta.variable}` :
        `variables.${action.meta.variable}`;

      return {
        ...state,
        [action.meta.entity]: {
          ...omit(state[action.meta.entity], variablePath),
        },
      };
    }
    default:
      return state;
  }
}

const actionCreators = {
  updateType,
  createType: createTypeThunk,
  createEdge: createEdgeThunk,
  deleteType: deleteTypeThunk,
  createVariable: createVariableThunk,
  deleteVariable: deleteVariableThunk,
  updateVariable: updateVariableThunk,
  updateDisplayVariable: updateDisplayVariableThunk,
};

const actionTypes = {
  CREATE_VARIABLE,
  UPDATE_VARIABLE,
  DELETE_VARIABLE,
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
};

const testing = {
  createType,
  deleteType,
  createVariable,
  updateVariable,
  deleteVariable,
};

export {
  actionCreators,
  actionTypes,
  testing,
};
