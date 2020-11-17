import { combineEpics } from 'redux-observable';
import { filter, mapTo } from 'rxjs/operators';
import {
  exportNetcanvas,
  createNetcanvasImport,
  readProtocol,
} from '@app/utils/netcanvasFile';
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

const OPEN_NETCANVAS = 'SESSION/OPEN_NETCANVAS';
const OPEN_NETCANVAS_SUCCESS = 'SESSION/OPEN_NETCANVAS_SUCCESS';
const OPEN_NETCANVAS_ERROR = 'SESSION/OPEN_NETCANVAS_ERROR';
const SAVE_NETCANVAS = 'SESSION/SAVE_NETCANVAS';
const SAVE_NETCANVAS_SUCCESS = 'SESSION/SAVE_NETCANVAS_SUCCESS';
const SAVE_NETCANVAS_ERROR = 'SESSION/SAVE_NETCANVAS_ERROR';
const SAVE_NETCANVAS_COPY = 'SESSION/SAVE_NETCANVAS_COPY';
const SAVE_NETCANVAS_COPY_SUCCESS = 'SESSION/SAVE_NETCANVAS_COPY_SUCCESS';
const SAVE_NETCANVAS_COPY_ERROR = 'SESSION/SAVE_NETCANVAS_COPY_ERROR';

const openNetcanvas = filePath =>
  dispatch =>
    Promise.resolve()
      .then(() => dispatch({ type: OPEN_NETCANVAS, payload: { filePath } }))
      // export protocol to random temp location
      .then(() => createNetcanvasImport(filePath))
      .then(workingPath =>
        readProtocol(workingPath)
          .then(protocol => dispatch({
            type: OPEN_NETCANVAS_SUCCESS,
            payload: { protocol, filePath, workingPath },
          })),
      )
      .catch((error) => {
        switch (error.code) {
          default:
            dispatch({ type: OPEN_NETCANVAS_ERROR, payload: { error, filePath } });
        }
      });

const saveNetcanvas = () =>
  (dispatch, getState) => {
    const state = getState();
    const session = state.session;
    const protocol = state.protocol;
    const protocolId = session.activeProtocol;
    const workingPath = session.workingPath;
    const filePath = session.filePath;

    dispatch({ type: SAVE_NETCANVAS, payload: { protocolId } })
      .then(() => exportNetcanvas(workingPath, protocol, filePath))
      .then(({ savePath, backupPath }) =>
        dispatch({ type: SAVE_NETCANVAS_SUCCESS, payload: { savePath, backupPath } }),
      )
      .catch((error) => {
        switch (error.code) {
          default:
            dispatch({ type: SAVE_NETCANVAS_ERROR, payload: { error, protocolId } });
        }
      });
  };

const saveAsNetcanvas = newFilePath =>
  (dispatch, getState) => {
    const state = getState();
    const session = state.session;
    const protocol = state.protocol;
    const protocolId = session.activeProtocol;
    const workingPath = session.workingPath;

    dispatch({ type: SAVE_NETCANVAS_COPY, payload: { protocolId } })
      // export protocol to random temp location
      .then(() => exportNetcanvas(workingPath, protocol, newFilePath))
      .then(({ savePath, backupPath }) =>
        dispatch({ type: SAVE_NETCANVAS_COPY_SUCCESS, payload: { savePath, backupPath } }),
      )
      .catch((error) => {
        switch (error.code) {
          default:
            dispatch({ type: SAVE_NETCANVAS_COPY_ERROR, payload: { error, protocolId } });
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
    case OPEN_NETCANVAS_SUCCESS: {
      const { id, filePath, workingPath } = action.payload;

      return {
        ...state,
        activeProtocol: id,
        filePath,
        workingPath,
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
  saveNetcanvas,
  saveAsNetcanvas,
  openNetcanvas,
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
