import { actionTypes as protocolStageActionTypes } from './protocol/stages';
import { actionTypes as protocolRegistryActionTypes } from './protocol/variableRegistry';
import { actionTypes as formActionTypes } from './protocol/forms';
import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as exportProtocolActionTypes } from './protocols/export';
import { actionTypes as loadProtocolActionTypes } from './protocols/load';

const initialState = {
  activeProtocol: {}, // protocolMeta
  lastSaved: 0,
  lastChanged: 0,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case loadProtocolActionTypes.LOAD_PROTOCOL_SUCCESS: {
      return {
        ...state,
        activeProtocol: action.meta.id,
        lastSaved: 0,
        lastChanged: 0,
      };
    }
    case exportProtocolActionTypes.EXPORT_PROTOCOL_SUCCESS:
      return {
        ...state,
        lastSaved: new Date().getTime(),
      };
    // All these actions are considered saveable changes:
    case protocolStageActionTypes.CREATE_STAGE:
    case protocolStageActionTypes.UPDATE_STAGE:
    case protocolStageActionTypes.DELETE_STAGE:
    case protocolRegistryActionTypes.UPDATE_TYPE:
    case protocolRegistryActionTypes.CREATE_TYPE:
    case protocolRegistryActionTypes.DELETE_TYPE:
    case formActionTypes.CREATE_FORM:
    case formActionTypes.UPDATE_FORM:
    case formActionTypes.DELETE_FORM:
    case protocolActionTypes.UPDATE_OPTIONS:
      return {
        ...state,
        lastChanged: new Date().getTime(),
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
