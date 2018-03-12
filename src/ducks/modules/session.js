import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as protocolSaveActionTypes } from './protocol/save';

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
    case protocolSaveActionTypes.SAVE_COMPLETE:
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
