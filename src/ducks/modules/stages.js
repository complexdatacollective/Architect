import { map, max } from 'lodash';

const ADD_STAGE = 'ADD_STAGE';

const initialState = [{ id: 1, type: 'name-generator' }, { id: 2, type: 'name-generator' }];

const nextId = state => (max(map(state, 'id')) + 1);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_STAGE:
      return [
        ...state.slice(0, action.index + 1),
        { title: '', type: action.interfaceType, id: nextId(state) },
        ...state.slice(action.index + 1),
      ];
    default:
      return state;
  }
}

function addStage(interfaceType, index) {
  return {
    type: ADD_STAGE,
    interfaceType,
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
