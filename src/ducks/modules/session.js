import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as protocolFileActionTypes } from './protocol/file';
import { actionTypes as protocolStageActionTypes } from './protocol/stages';

const initialState = {
  activeProtocol: '', // local path
  lastSaved: 0,
};

const RESET_ACTIVE_PROTOCOL = Symbol('SESSION/RESET_ACTIVE_PROTOCOL');

const resetActiveProtocol = () => ({
  type: RESET_ACTIVE_PROTOCOL,
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolActionTypes.SET_PROTOCOL: {
      return {
        ...state,
        activeProtocol: action.path,
      };
    }
    case RESET_ACTIVE_PROTOCOL: {
      return {
        ...state,
        activeProtocol: '',
      };
    }
    case protocolStageActionTypes.ADD_STAGE:
    case protocolStageActionTypes.UPDATE_STAGE:
      return {
        ...state,
        lastChanged: new Date().getTime(),
      };
    case protocolFileActionTypes.SAVE_COMPLETE:
      return {
        ...state,
        lastSaved: state.lastChanged,
      };
    default:
      return state;
  }
}

const actionCreators = {
  resetActiveProtocol,
};

const actionTypes = {
  RESET_ACTIVE_PROTOCOL,
};

export {
  actionCreators,
  actionTypes,
};
