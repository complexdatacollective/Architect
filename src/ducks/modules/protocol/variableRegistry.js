import { has } from 'lodash';

const UPDATE_TYPE = 'UPDATE_TYPE';
const CREATE_TYPE = 'CREATE_TYPE';

const initialState = {
};

function createType(category, type, configuration) {
  return {
    type: CREATE_TYPE,
    meta: {
      category,
      type,
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

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_TYPE:
      if (has(state, [action.meta.category, action.meta.type])) return state;
      return setType(state, action.meta.category, action.meta.type, action.configuration);
    case UPDATE_TYPE:
      return setType(state, action.meta.category, action.meta.type, action.configuration);
    default:
      return state;
  }
}

const actionCreators = {
  updateType,
  createType,
};

const actionTypes = {
  UPDATE_TYPE,
  CREATE_TYPE,
};

export {
  actionCreators,
  actionTypes,
};
