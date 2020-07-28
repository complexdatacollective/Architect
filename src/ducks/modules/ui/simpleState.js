import { omit } from 'lodash';

const SET_PROPERTY = 'UI/SET_PROPERTY';
const CLEAR_PROPERTY = 'UI/CLEAR_PROPERTY';

const initialState = {
};

const setProperty = (key, value) => ({
  type: SET_PROPERTY,
  payload: {
    key,
    value,
  },
});

const clearProperty = key => ({
  type: CLEAR_PROPERTY,
  payload: {
    key,
  },
});

export default (state = initialState, { type, payload } = { type: null, payload: null }) => {
  switch (type) {
    case SET_PROPERTY:
      return {
        ...state,
        [payload.key]: payload.value,
      };
    case CLEAR_PROPERTY: {
      return omit(state, payload.key);
    }
    default:
      return state;
  }
};

export const actionTypes = {
  SET_PROPERTY,
  CLEAR_PROPERTY,
};

export const actionCreators = {
  setProperty,
  clearProperty,
};
