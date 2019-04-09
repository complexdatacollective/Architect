import uuid from 'uuid';
import { omit } from 'lodash';
import { getCodebook } from '../../../selectors/codebook';
import { makeGetUsageForType } from '../../../selectors/usage';
import { getVariableIndex, utils as indexUtils } from '../../../selectors/indexes';
import { getNextCategoryColor } from './utils';
import { actionCreators as formActions } from './forms';
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

const updateVariable = (entity, type, variable, configuration) => ({
  type: UPDATE_VARIABLE,
  meta: {
    entity,
    type,
    variable,
  },
  configuration,
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
      category: entity,
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
      category: entity,
    };
  };

const createVariableThunk = (entity, type, configuration) =>
  (dispatch) => {
    const variable = uuid();

    dispatch(createVariable(entity, type, variable, configuration));

    return {
      entity,
      type,
      variable,
    };
  };

const deleteVariableThunk = (entity, type, variable) =>
  (dispatch, getState) => {
    const variableSearch = indexUtils.buildSearch([getVariableIndex(getState())]);
    if (variableSearch.has(variable)) { return false; }
    dispatch(deleteVariable(entity, type, variable));
    return true;
  };

const updateDisplayVariableThunk = (type, variable) =>
  (dispatch, getState) => {
    const codebook = getCodebook(getState());

    const updatedConfiguration = {
      ...codebook.node[type],
      displayVariable: variable,
    };

    dispatch(updateType('node', type, updatedConfiguration));
  };

const getDeleteAction = ({ type, ...owner }) => {
  switch (type) {
    case 'form':
      return formActions.deleteForm(owner.id);
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

const getStateWithUpdatedType = (state, entity, type, configuration) => ({
  ...state,
  [entity]: {
    ...state[entity],
    [type]: configuration,
  },
});

const getStateWithUpdatedVariable = (state, entity, type, variable, configuration) => {
  const variables = {
    ...state[entity][type].variables,
    [variable]: configuration,
  };

  return {
    ...state,
    [entity]: {
      ...state[entity],
      [type]: {
        ...state[entity][type],
        variables,
      },
    },
  };
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
    case CREATE_VARIABLE: {
      // Same as update variable?
      const { entity, type, variable } = action.meta;

      const variables = {
        ...state[entity][type].variables,
        [variable]: action.configuration,
      };

      return {
        ...state,
        [entity]: {
          ...state[entity],
          [type]: {
            ...state[entity][type],
            variables,
          },
        },
      };
    }
    case UPDATE_VARIABLE:
      return getStateWithUpdatedVariable(
        state,
        action.meta.entity,
        action.meta.type,
        action.meta.variable,
        action.configuration,
      );
    case DELETE_TYPE:
      return {
        ...state,
        [action.meta.entity]: {
          ...omit(state[action.meta.entity], [action.meta.type]),
        },
      };
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
  updateVariable,
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
};

export {
  actionCreators,
  actionTypes,
  testing,
};
