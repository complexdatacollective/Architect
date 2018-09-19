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

function createType(category, configuration) {
  return {
    type: CREATE_TYPE,
    meta: {
      type: uuid(),
      category,
    },
    configuration,
  };
}

function updateType(category, type, configuration) {
  return {
    type: UPDATE_TYPE,
    meta: {
      category,
      type,
    },
    configuration,
  };
}

const setType = (state, category, type, configuration) => ({
  ...state,
  [category]: {
    ...state[category],
    [type]: configuration,
  },
});

function deleteType(category, type) {
  return {
    type: DELETE_TYPE,
    meta: {
      category,
      type,
    },
  };
}

// check usage elsewhere, and delete related stages/forms
function deleteTypeAndRelatedObjects(category, type) {
  return (dispatch, getState) => {
    const getUsageForType = makeGetUsageForType(getState());
    const usageForType = getUsageForType(category, type);

    dispatch(deleteType(category, type));

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

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_TYPE:
    case UPDATE_TYPE:
      return setType(state, action.meta.category, action.meta.type, action.configuration);
    case DELETE_TYPE:
      return {
        ...state,
        [action.meta.category]: {
          ...omit(state[action.meta.category], [action.meta.type]),
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
  deleteTypeAndRelatedObjects,
};

const actionTypes = {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
};

export {
  actionCreators,
  actionTypes,
};
