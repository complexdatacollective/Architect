import uuid from 'uuid';
import { omit } from 'lodash';
import { actionCreators as formActions } from './forms';
import { actionCreators as stageActions } from './stages';
import { makeGetUsageForType } from '../../../selectors/variableRegistry';

const UPDATE_TYPE = 'UPDATE_TYPE';
const CREATE_TYPE = 'CREATE_TYPE';
const UPDATE_VARIABLE = 'UPDATE_VARIABLE';
const CREATE_VARIABLE = 'CREATE_VARIABLE';
const DELETE_TYPE = 'DELETE_TYPE';

const initialState = {
  edge: {},
  node: {},
};

const createType = (entity, configuration) =>
  (dispatch) => {
    const type = uuid();

    const action = {
      type: CREATE_TYPE,
      meta: {
        type,
        entity,
      },
      configuration,
    };

    dispatch(action);

    return {
      type,
      category: entity,
    };
  };

function updateType(entity, type, configuration) {
  return {
    type: UPDATE_TYPE,
    meta: {
      entity,
      type,
    },
    configuration,
  };
}

const createVariable = (entity, type, configuration) =>
  (dispatch) => {
    const variable = uuid();

    const action = {
      type: CREATE_VARIABLE,
      meta: {
        type,
        entity,
        variable,
      },
      configuration,
    };

    dispatch(action);

    return {
      entity,
      type,
      variable,
    };
  };

function updateVariable(entity, type, variable, configuration) {
  return {
    type: UPDATE_VARIABLE,
    meta: {
      entity,
      type,
      variable,
    },
    configuration,
  };
}

function deleteTypeAction(entity, type) {
  return {
    type: DELETE_TYPE,
    meta: {
      entity,
      type,
    },
  };
}

function deleteType(entity, type, deleteRelatedObjects = false) {
  return (dispatch, getState) => {
    dispatch(deleteTypeAction(entity, type));

    if (!deleteRelatedObjects) { return; }

    // check usage elsewhere, and delete related stages/forms
    const getUsageForType = makeGetUsageForType(getState());
    const usageForType = getUsageForType(entity, type);

    usageForType.forEach(({ owner }) => {
      switch (owner.type) {
        case 'form':
          dispatch(formActions.deleteForm(owner.id));
          break;
        case 'stage':
          dispatch(stageActions.deleteStage(owner.id));
          break;
        case 'prompt':
          dispatch(stageActions.deletePrompt(owner.stageId, owner.promptId, true));
          break;
        default:
          // noop
      }
    });
  };
}

const getStateWithUpdatedType = (state, entity, type, configuration) => ({
  ...state,
  [entity]: {
    ...state[entity],
    [type]: configuration,
  },
});

const getStateWithUpdatedVariable = (state, entity, type, variableId, configuration) => ({
  ...state,
  [entity]: {
    ...state[entity],
    [type]: {
      ...state[entity][type],
      variables: state[entity][type].variables.map((variable) => {
        if (variable.id !== variableId) { return variable; }
        return {
          ...configuration,
          id: variable.id,
        };
      }),
    },
  },
});

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
    case CREATE_VARIABLE:
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
  createType,
  deleteType,
  createVariable,
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
  deleteTypeAction,
};

export {
  actionCreators,
  actionTypes,
  testing,
};
