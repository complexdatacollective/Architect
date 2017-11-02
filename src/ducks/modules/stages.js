import { map, max } from 'lodash';

const ADD_STAGE = Symbol('STAGES/ADD_STAGE');
const UPDATE_STAGE = Symbol('STAGES/UPDATE_STAGE');

const initialState = [{ id: 1, type: 'NameGenerator' }, { id: 2, type: 'Sociogram' }];

const maxId = state => max(map(state, 'id'));
const nextId = state => ((maxId(state) || 0) + 1);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_STAGE:
      return [
        ...state.slice(0, action.index),
        { ...action.options, id: nextId(state) },
        ...state.slice(action.index),
      ];
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

function updateStage(stageId, options) {
  return {
    type: UPDATE_STAGE,
    stageId,
    options,
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
