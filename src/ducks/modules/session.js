import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as protocolFileActionTypes } from './protocol/file';

const initialState = {
  activeProtocol: '', // local path
  lastSaved: 0,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolActionTypes.SET_PROTOCOL: {
      return {
        ...state,
        activeProtocol: action.path,
      };
    }
    case protocolFileActionTypes.SAVE_COMPLETE:
      return {
        ...state,
        lastSaved: action.lastSaved,
      };
    default:
      return state;
  }
}

const actionCreators = {
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};
