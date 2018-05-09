import uuid from 'uuid/v1';

const CREATE_STAGE = Symbol('PROTOCOL/CREATE_STAGE');
const UPDATE_STAGE = Symbol('PROTOCOL/UPDATE_STAGE');

const initialState = [];
const initialStage = {
  label: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_STAGE: {
      debugger;
      const stage = { ...initialStage, ...action.stage, id: uuid() };
      const insertAtIndex = action.index || state.length;

      return [
        ...state.slice(0, insertAtIndex),
        stage,
        ...state.slice(insertAtIndex),
      ];
    }
    case UPDATE_STAGE:
      debugger;
      return state.map((stage) => {
        if (stage.id !== action.id) { return stage; }

        if (action.overwrite) { return { ...action.stage, id: stage.id }; }

        return {
          ...stage,
          ...action.stage,
          id: stage.id,
        };
      });
    default:
      return state;
  }
}

function createStage(stage, index = null) {
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

const actionCreators = {
  createStage,
  updateStage,
};

const actionTypes = {
  CREATE_STAGE,
  UPDATE_STAGE,
};

export {
  actionCreators,
  actionTypes,
};
