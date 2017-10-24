const UPDATE_OPTIONS = Symbol('UPDATE_OPTIONS');

const initialState = {
  title: 'My Protocol',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_OPTIONS:
      return {
        ...state,
        ...action.options,
      };
    default:
      return state;
  }
}

function updateOptions(options) {
  return {
    type: UPDATE_OPTIONS,
    options,
  };
}

const actionCreators = {
  updateOptions,
};

const actionTypes = {
  UPDATE_OPTIONS,
};

export {
  actionCreators,
  actionTypes,
};
