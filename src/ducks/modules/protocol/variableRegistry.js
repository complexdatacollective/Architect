import { has, omit } from 'lodash';

const UPDATE_TYPE = 'UPDATE_TYPE';
const CREATE_TYPE = 'CREATE_TYPE';
const DELETE_TYPE = 'DELETE_TYPE';

const initialState = {
  edge: {},
  node: {},
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

function deleteType(category, type) {
  return {
    type: DELETE_TYPE,
    meta: {
      category,
      type,
    },
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_TYPE:
      if (has(state, [action.meta.category, action.meta.type])) return state;
      return setType(state, action.meta.category, action.meta.type, action.configuration);
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
