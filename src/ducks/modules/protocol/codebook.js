import uuid from 'uuid';
import { omit } from 'lodash';
import { actionCreators as formActions } from './forms';
import { actionCreators as stageActions } from './stages';
import { makeGetUsageForType } from '../../../selectors/codebook';

const UPDATE_TYPE = 'UPDATE_TYPE';
const CREATE_TYPE = 'CREATE_TYPE';
const UPDATE_VARIABLE = 'UPDATE_VARIABLE';
const CREATE_VARIABLE = 'CREATE_VARIABLE';
const DELETE_TYPE = 'DELETE_TYPE';

const initialState = {
  edge: {},
  node: {},
};

const createType = (entity, type, configuration) => ({
  type: CREATE_TYPE,
  meta: {
    type,
    entity,
  },
  configuration,
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

const updateType = (entity, type, configuration) => ({
  type: UPDATE_TYPE,
  meta: {
    entity,
    type,
  },
  configuration,
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

const updateVariable = (entity, type, variable, configuration) => ({
  type: UPDATE_VARIABLE,
  meta: {
    entity,
    type,
    variable,
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
  deleteType: deleteTypeThunk,
  createVariable: createVariableThunk,
  updateVariable,
};

const actionTypes = {
  CREATE_VARIABLE,
  UPDATE_VARIABLE,
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
