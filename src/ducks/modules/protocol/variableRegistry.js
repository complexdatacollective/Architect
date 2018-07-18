const UPDATE_TYPE = 'UPDATE_TYPE';

const initialState = {
};

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

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_TYPE:
      return {
        ...state,
        [action.meta.category]: {
          ...state[action.meta.category],
          [action.meta.type]: action.configuration,
        },
      };
    default:
      return state;
  }
}

const actionCreators = {
  updateType,
};

const actionTypes = {
  UPDATE_TYPE,
};

export {
  actionCreators,
  actionTypes,
};
