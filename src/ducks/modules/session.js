import { combineEpics } from 'redux-observable';
import { filter, mapTo } from 'rxjs/operators';
import { actionTypes as protocolStageActionTypes } from './protocol/stages';
import { actionTypes as protocolRegistryActionTypes } from './protocol/variableRegistry';
import { actionTypes as formActionTypes } from './protocol/forms';
import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as exportProtocolActionTypes } from './protocols/export';
import { actionTypes as loadProtocolActionTypes } from './protocols/load';

// All these actions are considered saveable changes:
const savableChanges = [
  protocolStageActionTypes.CREATE_STAGE,
  protocolStageActionTypes.MOVE_STAGE,
  protocolStageActionTypes.UPDATE_STAGE,
  protocolStageActionTypes.DELETE_STAGE,
  protocolStageActionTypes.DELETE_PROMPT,
  protocolRegistryActionTypes.UPDATE_TYPE,
  protocolRegistryActionTypes.CREATE_TYPE,
  protocolRegistryActionTypes.DELETE_TYPE,
  formActionTypes.CREATE_FORM,
  formActionTypes.UPDATE_FORM,
  formActionTypes.DELETE_FORM,
  protocolActionTypes.UPDATE_OPTIONS,
];

const RESET_SESSION = 'SESSION/RESET';
const PROTOCOL_CHANGED = 'SESSION/PROTOCOL_CHANGED';

const resetSession = () => ({
  type: RESET_SESSION,
});

const protocolChanged = () => ({
  type: PROTOCOL_CHANGED,
});

const initialState = {
  activeProtocol: null,
  lastSaved: 0,
  lastChanged: 0,
};

// Track savable changes, and emit changed action
const protocolChangedEpic = action$ =>
  action$.pipe(
    filter(({ type }) => savableChanges.includes(type)),
    mapTo(protocolChanged()),
  );

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
        lastSaved: new Date().toJSON(),
      };
    case PROTOCOL_CHANGED:
      return {
        ...state,
        lastChanged: new Date().toJSON(),
      };
    case RESET_SESSION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

const actionCreators = {
  resetSession,
  protocolChanged,
};

const actionTypes = {
  RESET_SESSION,
};

const epics = combineEpics(
  protocolChangedEpic,
);

export {
  actionCreators,
  actionTypes,
  epics,
};
