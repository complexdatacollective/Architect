import { actionCreators as protocolActions } from './protocol';

const UPDATE_META = Symbol('UPDATE_META');

const initialState = {
  location: '', // local path
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolActions.SET_PROTOCOL:
      return {
        ...state,
        activeProtocol: action.path,
      };
    case UPDATE_META:
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
    type: UPDATE_META,
    options,
  };
}

const actionCreators = {
  updateOptions,
};

const actionTypes = {
  UPDATE_META,
};

export {
  actionCreators,
  actionTypes,
};
