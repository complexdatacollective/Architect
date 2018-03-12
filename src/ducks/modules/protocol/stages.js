import uuid from 'uuid/v1';

const ADD_STAGE = Symbol('PROTOCOL/ADD_STAGE');
const UPDATE_STAGE = Symbol('PROTOCOL/UPDATE_STAGE');

const initialState = [];
const initialStage = {
  label: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_STAGE:
      return [
        ...state.slice(0, action.index),
        { ...initialStage, ...action.options, id: uuid() },
        ...state.slice(action.index),
      ];
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
    default:
      return state;
  }
}

function addStage(options, index) {
  return {
    type: ADD_STAGE,
    options,
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
  addStage,
  updateStage,
};

const actionTypes = {
  ADD_STAGE,
  UPDATE_STAGE,
};

export {
  actionCreators,
  actionTypes,
};
