import { map, max } from 'lodash';

const ADD_STAGE = 'ADD_STAGE';

const initialState = [{ id: 1, type: 'NameGenerator' }, { id: 2, type: 'Sociogram' }];

const nextId = state => (max(map(state, 'id')) + 1);

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

const actionCreators = {
  addStage,
};

const actionTypes = {
  ADD_STAGE,
};

export {
  actionCreators,
  actionTypes,
};
