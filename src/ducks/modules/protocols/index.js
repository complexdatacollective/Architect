import uuid from 'uuid';
import openProtocolDialog from '@app/other/protocols/utils/openProtocolDialog';
import history from '@app/history';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { actionCreators as createActionCreators } from './create';
import { actionCreators as unbundleActionCreators } from './unbundle';
import { actionCreators as preflightActions } from './preflight';
import { actionCreators as saveActionCreators } from './save';
import { actionCreators as bundleActionCreators } from './bundle';
import { actionCreators as previewActions } from '../preview';
import { saveErrorDialog, importErrorDialog } from './dialogs';
import {
  actionCreators as registerActionCreators,
  actionTypes as registerActionTypes,
} from './register';

const SAVE_COPY = 'PROTOCOLS/SAVE_COPY';
const SAVE_AND_EXPORT_ERROR = 'PROTOCOLS/SAVE_AND_EXPORT_ERROR';
const UNBUNDLE_AND_LOAD_ERROR = 'PROTOCOLS/UNBUNDLE_AND_LOAD_ERROR';
const CREATE_AND_LOAD_ERROR = 'PROTOCOLS/CREATE_AND_LOAD_ERROR';
const OPEN_START = 'PROTOCOLS/OPEN_START';
const OPEN_COMPLETE = 'PROTOCOLS/OPEN_COMPLETE';
const OPEN_ERROR = 'PROTOCOLS/OPEN_ERROR';
const LOCK = 'PROTOCOLS/LOCK';
const UNLOCK = 'PROTOCOLS/UNLOCK';

const saveAndExportError = error => ({
  type: SAVE_AND_EXPORT_ERROR,
  error,
});

const unbundleAndLoadError = error => ({
  type: UNBUNDLE_AND_LOAD_ERROR,
  error,
});

const createAndLoadError = error => ({
  type: CREATE_AND_LOAD_ERROR,
  error,
});

const openStart = filePath => ({
  type: OPEN_START,
  payload: filePath,
});

const openComplete = filePath => ({
  type: OPEN_COMPLETE,
  payload: filePath,
});

const openError = error => ({
  type: OPEN_ERROR,
  error,
});

const lockUnbundle = next =>
  (dispatch, getState) => {
    const state = getState();
    if (state.lock) { return; }

    dispatch({ type: LOCK });

    next()
      .finally(() => {
        dispatch({ type: UNLOCK });
      });
  };

/**
 * 1. Save - write protocol to protocol.json
 * 2. Export - write /tmp/{working-path} to user space.
 */
const saveAndBundleThunk = () =>
  (dispatch, getState) => {
    const { filePath } = getActiveProtocolMeta(getState());

    return dispatch(preflightActions.preflight())
      .then(() => dispatch(saveActionCreators.saveProtocol()))
      .then(() => dispatch(bundleActionCreators.bundleProtocol()))
      .catch((e) => {
        dispatch(saveAndExportError(e));
        dispatch(saveErrorDialog(e, filePath));
      });
  };

/**
 * 1. Import - extract/copy protocol to /tmp/{working-path}
 * 2. Load - redirect to /edit/ which should trigger load.
 */
const unbundleAndLoadThunk = filePath =>
  (dispatch) => {
    // TODO: Reset `screens` here?
    dispatch(previewActions.closePreview());
    dispatch(openStart(filePath));
    return dispatch(unbundleActionCreators.unbundleProtocol(filePath))
      .then(({ id }) => {
        history.push(`/edit/${id}/`);
        return id;
      })
      .finally(() => dispatch(openComplete(filePath)))
      .catch((e) => {
        dispatch(unbundleAndLoadError(e));
        dispatch(importErrorDialog(e, filePath));
      });
  };

/**
 * 1. Create - Create a new protocol from template
 * 2. Run unbundleAndLoadThunk on new protocol
 */
const createAndLoadProtocolThunk = () =>
  dispatch =>
    dispatch(createActionCreators.createProtocol())
      .then(({ filePath, workingPath }) =>
        dispatch(registerActionCreators.registerProtocol({ filePath, workingPath })),
      )
      .then(({ id }) => {
        history.push(`/edit/${id}/`);
        return id;
      })
      .catch(e => dispatch(createAndLoadError(e)));

/**
 * 1. Locate protocol in user space with Electron dialog
 * 2. Run unbundleAndLoadThunk on specified path
 */
const openProtocol = () =>
  dispatch =>
    openProtocolDialog()
      .then(({ cancelled, filePath }) => {
        if (cancelled) { return false; }
        return dispatch(unbundleAndLoadThunk(filePath));
      })
      .catch(e => dispatch(openError(e)));

/**
 * 1. Create a duplicate entry in protocols, taking the original's working path
 * 2. Save to the new location
 */
const saveCopyThunk = filePath =>
  (dispatch, getState) => {
    const activeProtocolMeta = getActiveProtocolMeta(getState());

    dispatch({
      type: SAVE_COPY,
      id: activeProtocolMeta.id,
      filePath,
    });

    dispatch(saveAndBundleThunk());
  };

const initialState = {
  lock: false,
  protocols: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case registerActionTypes.REGISTER_PROTOCOL:
      return {
        ...state,
        protocols: [
          ...state.protocols,
          {
            filePath: action.filePath,
            id: action.id,
            advanced: action.advanced,
            workingPath: action.workingPath,
          },
        ].slice(-10),
      };
    case SAVE_COPY: {
      /**
       * We modify the original to use the new filePath so we can effectively take the working
       * changes. Then we make a new entry for the original protocol with the old filePath.
       */

      const originalProtocolIndex = state.findIndex(({ id }) => id === action.id);
      const originalProtocolEntry = state[originalProtocolIndex];

      const copyProtocolEntry = {
        ...originalProtocolEntry,
        filePath: action.filePath,
      };

      const updatedOriginalEntry = {
        ...originalProtocolEntry,
        id: uuid(),
        workingPath: null,
      };

      const newProtocols = [
        ...state.slice(0, originalProtocolIndex - 1),
        copyProtocolEntry,
        updatedOriginalEntry,
        ...state.slice(originalProtocolIndex + 1),
      ];

      return {
        ...state,
        protocols: newProtocols,
      };
    }
    case LOCK:
      return {
        ...state,
        lock: true,
      };
    case UNLOCK:
      return {
        ...state,
        lock: false,
      };
    default:
      return state;
  }
}

const actionCreators = {
  createAndLoadProtocol: createAndLoadProtocolThunk,
  saveAndBundleProtocol: saveAndBundleThunk,
  unbundleAndLoadProtocol: unbundleAndLoadThunk,
  openProtocol,
  saveCopy: saveCopyThunk,
  openStart,
  openComplete,
};

const actionTypes = {
  SAVE_AND_EXPORT_ERROR,
  UNBUNDLE_AND_LOAD_ERROR,
  CREATE_AND_LOAD_ERROR,
  OPEN_ERROR,
  OPEN_START,
  OPEN_COMPLETE,
};

export {
  actionCreators,
  actionTypes,
};

