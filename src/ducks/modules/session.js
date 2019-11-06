import { combineEpics } from 'redux-observable';
import { filter, mapTo } from 'rxjs/operators';
import { actionTypes as protocolStageActionTypes } from './protocol/stages';
import { actionTypes as codebookActionTypes } from './protocol/codebook';
import { actionTypes as assetManifestTypes } from './protocol/assetManifest';
import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as bundleActionTypes } from './protocols/bundle';
import { actionTypes as loadProtocolActionTypes } from './protocols/load';

// All these actions are considered saveable changes:
const savableChanges = [
  protocolStageActionTypes.CREATE_STAGE,
  protocolStageActionTypes.MOVE_STAGE,
  protocolStageActionTypes.UPDATE_STAGE,
  protocolStageActionTypes.DELETE_STAGE,
  protocolStageActionTypes.DELETE_PROMPT,
  codebookActionTypes.UPDATE_TYPE,
  codebookActionTypes.CREATE_TYPE,
  codebookActionTypes.DELETE_TYPE,
  codebookActionTypes.CREATE_VARIABLE,
  codebookActionTypes.UPDATE_VARIABLE,
  codebookActionTypes.DELETE_VARIABLE,
  protocolActionTypes.UPDATE_OPTIONS,
  assetManifestTypes.IMPORT_ASSET_COMPLETE,
  assetManifestTypes.DELETE_ASSET,
];

const RESET_SESSION = 'SESSION/RESET';
const PROTOCOL_CHANGED = 'SESSION/PROTOCOL_CHANGED';

const resetSession = () => ({
  type: RESET_SESSION,
  ipc: true,
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
    case bundleActionTypes.BUNDLE_PROTOCOL_SUCCESS:
      return {
        ...state,
        lastSaved: new Date().getTime(),
      };
    case PROTOCOL_CHANGED:
      return {
        ...state,
        lastChanged: new Date().getTime(),
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
