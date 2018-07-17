import { merge } from 'lodash';

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
    case UPDATE_TYPE: {
      const type = {
        [action.meta.category]: {
          [action.meta.type]: action.configuration,
        },
      };
      return merge(
        state,
        type,
      );
    }
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
