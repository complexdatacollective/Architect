import uuid from 'uuid';
import { omit } from 'lodash';
import { actionCreators as formActions } from './forms';
import { actionCreators as stageActions } from './stages';
import { makeGetUsageForType } from '../../../selectors/variableRegistry';

const UPDATE_TYPE = 'UPDATE_TYPE';
const CREATE_TYPE = 'CREATE_TYPE';
const DELETE_TYPE = 'DELETE_TYPE';

const initialState = {
  edge: {},
  node: {},
};

function createType(entity, configuration) {
  return {
    type: CREATE_TYPE,
    meta: {
      type: uuid(),
      entity,
    },
    configuration,
  };
}

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

const setType = (state, entity, type, configuration) => ({
  ...state,
  [entity]: {
    ...state[entity],
    [type]: configuration,
  },
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_TYPE:
    case UPDATE_TYPE:
      return setType(state, action.meta.entity, action.meta.type, action.configuration);
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
};

const actionTypes = {
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
