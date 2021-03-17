// import { combineEpics } from 'redux-observable';
// import { filter, mergeMap } from 'rxjs/operators';
import * as netcanvasFile from '@app/utils/netcanvasFile';
import { getProtocol } from '@selectors/protocol';
// import validateProtocol from '@app/utils/validateProtocol';
import { actionCreators as timelineActions } from '@app/ducks/middleware/timeline';
import { actionCreators as previewActions } from '@modules/preview';
import { actionTypes as protocolActionTypes } from '@modules/protocol';
import { actionTypes as protocolStageActionTypes } from '@modules/protocol/stages';
import { actionTypes as codebookActionTypes } from '@modules/protocol/codebook';
import { actionTypes as assetManifestTypes } from '@modules/protocol/assetManifest';

// All these actions are considered saveable changes:
// const savableChanges = [
//   protocolStageActionTypes.CREATE_STAGE,
//   protocolStageActionTypes.MOVE_STAGE,
//   protocolStageActionTypes.UPDATE_STAGE,
//   protocolStageActionTypes.DELETE_STAGE,
//   protocolStageActionTypes.DELETE_PROMPT,
//   codebookActionTypes.UPDATE_TYPE,
//   codebookActionTypes.CREATE_TYPE,
//   codebookActionTypes.DELETE_TYPE,
//   codebookActionTypes.CREATE_VARIABLE,
//   codebookActionTypes.UPDATE_VARIABLE,
//   codebookActionTypes.DELETE_VARIABLE,
//   protocolActionTypes.UPDATE_OPTIONS,
//   assetManifestTypes.IMPORT_ASSET_COMPLETE,
//   assetManifestTypes.DELETE_ASSET,
// ];

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

// TODO: This should handle validation rather than in userActions
const openNetcanvas = (filePath, protocolIsValid = false) => (dispatch) => Promise.resolve()
  .then(() => dispatch({ type: OPEN_NETCANVAS, payload: { filePath } }))
// export protocol to random temp location
  .then(() => netcanvasFile.importNetcanvas(filePath))
  .then((workingPath) => netcanvasFile.readProtocol(workingPath)
    .then((protocol) => dispatch({
      type: OPEN_NETCANVAS_SUCCESS,
      payload: {
        protocol, filePath, workingPath, protocolIsValid,
      },
      ipc: true,
    })))
  .then(() => dispatch(timelineActions.reset()))
  .then(() => filePath)
  .catch((error) => {
    switch (error.code) {
      default:
        dispatch({ type: OPEN_NETCANVAS_ERROR, payload: { error, filePath } });
    }

    throw error;
  });

const saveNetcanvas = () => (dispatch, getState) => {
  const state = getState();
  const { session } = state;
  const protocol = getProtocol(state);
  const { workingPath } = session;
  const { filePath } = session;

  return Promise.resolve()
    .then(() => dispatch({ type: SAVE_NETCANVAS, payload: { workingPath, filePath } }))
    .then(() => netcanvasFile.saveNetcanvas(workingPath, protocol, filePath))
    .then((savePath) => {
      dispatch({
        type: SAVE_NETCANVAS_SUCCESS,
        payload: {
          savePath,
          protocol,
        },
        ipc: true,
      });
      return savePath;
    })
    .catch((error) => {
      switch (error.code) {
        default:
          dispatch({ type: SAVE_NETCANVAS_ERROR, payload: { error, workingPath, filePath } });
      }

      throw error;
    });
};

const saveAsNetcanvas = (newFilePath) => (dispatch, getState) => {
  const state = getState();
  const { session } = state;
  const protocol = getProtocol(state);
  const { workingPath } = session;

  return Promise.resolve()
    .then(() => dispatch({
      type: SAVE_NETCANVAS_COPY,
      payload: { workingPath, filePath: newFilePath },
    }))
  // export protocol to random temp location
    .then(() => netcanvasFile.saveNetcanvas(workingPath, protocol, newFilePath))
    .then((savePath) => {
      dispatch({ type: SAVE_NETCANVAS_COPY_SUCCESS, payload: { savePath } });
      return savePath;
    })
    .catch((error) => {
      switch (error.code) {
        default:
          dispatch({
            type: SAVE_NETCANVAS_COPY_ERROR,
            payload: { error, workingPath, filePath: newFilePath },
          });
      }

      throw error;
    });
};

const resetSession = () => (dispatch) => {
  dispatch(previewActions.clearPreview());
  dispatch(previewActions.closePreview());

  dispatch({
    type: RESET_SESSION,
    ipc: true,
  });
};

// Decorate this event with the current protocol validation
// status so that we can selectively enable/disable the
// native save function.
export const protocolChanged = (protocolIsValid) => ({
  type: PROTOCOL_CHANGED,
  protocolIsValid,
  ipc: true,
});

const initialState = {
  workingPath: null,
  filePath: null,
  lastSaved: 0,
  lastChanged: 0,
  protocolIsValid: false,
};

// Track savable changes, and emit changed action
// const protocolChangedEpic = (action$, { getState }) => action$.pipe(
//   filter(({ type }) => savableChanges.includes(type)),
//   mergeMap(async () => {
//     const protocol = getProtocol(getState());

//     return validateProtocol(protocol)
//       .then(() => protocolChanged(true))
//       .catch(() => protocolChanged(false));
//   }),
// );

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_NETCANVAS_SUCCESS: {
      const { filePath, workingPath, protocolIsValid } = action.payload;

      return {
        ...state,
        filePath,
        workingPath,
        lastSaved: 0,
        lastChanged: 0,
        protocolIsValid,
      };
    }
    case SAVE_NETCANVAS_SUCCESS:
      return {
        ...state,
        filePath: action.payload.savePath,
        lastSaved: new Date().getTime(),
      };
    case PROTOCOL_CHANGED:
      return {
        ...state,
        lastChanged: new Date().getTime(),
        protocolIsValid: action.protocolIsValid,
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
  PROTOCOL_CHANGED,
  OPEN_NETCANVAS,
  OPEN_NETCANVAS_SUCCESS,
  OPEN_NETCANVAS_ERROR,
  SAVE_NETCANVAS,
  SAVE_NETCANVAS_SUCCESS,
  SAVE_NETCANVAS_ERROR,
  SAVE_NETCANVAS_COPY,
  SAVE_NETCANVAS_COPY_SUCCESS,
  SAVE_NETCANVAS_COPY_ERROR,
};

// const epics = combineEpics(
//   protocolChangedEpic,
// );

export {
  actionCreators,
  actionTypes,
  // epics,
};
