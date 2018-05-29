import uuid from 'uuid/v1';
import { get } from 'lodash';

const CREATE_STAGE = Symbol('PROTOCOL/CREATE_STAGE');
const UPDATE_STAGE = Symbol('PROTOCOL/UPDATE_STAGE');
const DELETE_STAGE = Symbol('PROTOCOL/DELETE_STAGE');

const initialState = [];
const initialStage = {
  label: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_STAGE: {
      const stage = { ...initialStage, ...action.stage, id: uuid() };
      const insertAtIndex = get(action, 'index', state.length);

      return [
        ...state.slice(0, insertAtIndex),
        stage,
        ...state.slice(insertAtIndex),
      ];
    }
    case UPDATE_STAGE:
      return state.map((stage) => {
        if (stage.id !== action.id) { return stage; }

        if (action.overwrite) { return { ...action.stage, id: stage.id }; }

        return {
          ...stage,
          ...action.stage,
          id: stage.id,
        };
      });
    case DELETE_STAGE:
      return state.filter(stage => (stage.id !== action.id));
    default:
      return state;
  }
}

function createStage(stage, index) {
  return {
    type: CREATE_STAGE,
    stage,
    index,
  };
}

function updateStage(stageId, stage, overwrite = false) {
  return {
    type: UPDATE_STAGE,
    id: stageId,
    stage,
    overwrite,
  };
}

function deleteStage(stageId) {
  return {
    type: DELETE_STAGE,
    id: stageId,
  };
}

const actionCreators = {
  createStage,
  updateStage,
  deleteStage,
};

const actionTypes = {
  CREATE_STAGE,
  UPDATE_STAGE,
  DELETE_STAGE,
};

export {
  actionCreators,
  actionTypes,
};
