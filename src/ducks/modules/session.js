import { combineEpics } from 'redux-observable';
import { filter, mapTo } from 'rxjs/operators';
import { actionCreators as previewActions } from '@modules/preview';
import { actionTypes as protocolStageActionTypes } from './protocol/stages';
import { actionTypes as codebookActionTypes } from './protocol/codebook';
import { actionTypes as assetManifestTypes } from './protocol/assetManifest';
import { actionTypes as protocolActionTypes } from './protocol';
import { actionTypes as bundleProtocolActionTypes } from './protocols/bundle';
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
const IMPORT_NETCANVAS = 'SESSION/IMPORT_NETCANVAS';
const SAVE_NETCANVAS = 'SESSION/SAVE_NETCANVAS';
const SAVE_COPY = 'SESSION/SAVE_COPY';

const exportNetcanvas = () =>
  (dispatch, getState) => {
    const state = getState();
    const session = state.session;
    const protocol = state.protocol;
    dispatch({ type: SAVE_PROTOCOL, protocolId: session.activeProtocol });

    // export protocol to random temp location
    file.exportNetcanvas(session.workingPath, protocol)
      .then(exportPath =>
        // open and validate the completed export
        file.verifyNetcanvas(exportPath)
          // rename existing file to backup location, and move export to this location
          // resolves to `{ savePath: [destination i.e. filePath], backupPath: [backup path] }`
          .then(() => file.backupAndReplace(exportPath, session.filePath)),
      )
      .then(({ savePath, backupPath }) =>
        dispatch({ type: SAVE_PROTOCOL_SUCCESS, payload: { savePath, backupPath } }),
      )
      .catch(error => {
        switch (error.code) {
          default:
            dispatch({ type: SAVE_PROTOCOL_ERROR, payload: { error } }),
        }
      });
  };

const resetSession = () =>
  (dispatch) => {
    dispatch(previewActions.clearPreview());

    dispatch({
      type: RESET_SESSION,
      ipc: true,
    });
  };

const protocolChanged = () => ({
  type: PROTOCOL_CHANGED,
});

const initialState = {
  activeProtocol: null,
  workingPath: null,
  filePath: null,
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
    case bundleProtocolActionTypes.BUNDLE_PROTOCOL_SUCCESS:
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
