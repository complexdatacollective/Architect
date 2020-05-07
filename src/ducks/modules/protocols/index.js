import uuid from 'uuid';
import { openDialog, saveCopyDialog } from '@app/other/dialogs';
import history from '@app/history';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getHasUnsavedChanges } from '@selectors/session';
import { createLock } from '@modules/ui/status';
import { actionCreators as dialogsActions } from '@modules/dialogs';
import { actionCreators as sessionActions } from '@modules/session';
import { UnsavedChanges } from '@components/Dialogs';
import { actionCreators as createActionCreators } from './create';
import { actionCreators as unbundleActionCreators } from './unbundle';
import { actionCreators as preflightActions } from './preflight';
import { actionCreators as saveActionCreators } from './save';
import { actionCreators as bundleActionCreators } from './bundle';
import { saveErrorDialog, importErrorDialog } from './dialogs';
import {
  actionCreators as registerActionCreators,
  actionTypes as registerActionTypes,
} from './register';

const protocolsLock = createLock('PROTOCOLS');
const loadingLock = createLock('PROTOCOLS/LOADING');
const savingLock = createLock('PROTOCOLS/SAVING');

const SAVE_COPY = 'PROTOCOLS/SAVE_COPY';
const SAVE_AND_EXPORT_ERROR = 'PROTOCOLS/SAVE_AND_EXPORT_ERROR';
const UNBUNDLE_AND_LOAD_ERROR = 'PROTOCOLS/UNBUNDLE_AND_LOAD_ERROR';
const CREATE_AND_LOAD_ERROR = 'PROTOCOLS/CREATE_AND_LOAD_ERROR';
const OPEN_ERROR = 'PROTOCOLS/OPEN_ERROR';

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

const openError = error => ({
  type: OPEN_ERROR,
  error,
});

/**
 * 1. Save - write protocol to protocol.json
 * 2. Export - write /tmp/{working-path} to user space.
 */
const saveAndBundleThunk = savingLock(() =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(() => {
        const activeProtocolMeta = getActiveProtocolMeta(getState());

        if (!activeProtocolMeta) {
          return dispatch(saveAndExportError('No active protocol found'));
        }

        return dispatch(preflightActions.preflight())
          .then(() => dispatch(saveActionCreators.saveProtocol()))
          .then(() => dispatch(bundleActionCreators.bundleProtocol()))
          .catch((e) => {
            dispatch(saveAndExportError(e));
            dispatch(saveErrorDialog(e, activeProtocolMeta.filePath));
          });
      }));

/**
 * 1. Import - extract/copy protocol to /tmp/{working-path}
 * 2. Load - redirect to /edit/ which should trigger load.
 */
const unbundleAndLoadThunk = filePath =>
  dispatch =>
    Promise.resolve()
      .then(() => {
        dispatch(sessionActions.resetSession());
        return dispatch(unbundleActionCreators.unbundleProtocol(filePath))
          .then((result) => {
            if (!result) { return false; }
            const { id } = result;
            history.push(`/edit/${id}/`);
            return id;
          })
          .catch((e) => {
            dispatch(unbundleAndLoadError(e));
            dispatch(importErrorDialog(e, filePath));
          });
      });

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
  (dispatch, getState) =>
    Promise.resolve(getHasUnsavedChanges(getState()))
      .then((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) { return true; }

        const unsavedChangesDialog = UnsavedChanges({
          confirmLabel: 'Save changes and continue?',
        });

        return dispatch(dialogsActions.openDialog(unsavedChangesDialog))
          .then((confirm) => {
            if (!confirm) { return false; }

            return dispatch(saveAndBundleThunk())
              .then(() => dispatch(sessionActions.resetSession()))
              .then(() => confirm);
          });
      })
      .then((confirm) => {
        if (!confirm) { return false; }

        return openDialog()
          .then(({ cancelled, filePath }) => {
            if (cancelled) { return false; }
            return dispatch(unbundleAndLoadThunk(filePath));
          });
      })
      .catch(e => dispatch(openError(e)));

/**
 * 1. Create a duplicate entry in protocols, taking the original's working path
 * 2. Save to the new location
 */
const saveCopyThunk = () =>
  (dispatch, getState) => {
    const activeProtocolMeta = getActiveProtocolMeta(getState());

    return saveCopyDialog({
      defaultPath: activeProtocolMeta.filePath,
    })
      .then(({ cancelled, filePath }) => {
        if (cancelled) { return false; }

        dispatch({
          type: SAVE_COPY,
          id: activeProtocolMeta.id,
          filePath,
        });

        return dispatch(saveAndBundleThunk());
      });
  };

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case registerActionTypes.REGISTER_PROTOCOL:
      return [
        ...state,
        {
          filePath: action.filePath,
          id: action.id,
          advanced: action.advanced,
          workingPath: action.workingPath,
        },
      ].slice(-10);
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

      const newState = [
        ...state.slice(0, originalProtocolIndex - 1),
        copyProtocolEntry,
        updatedOriginalEntry,
        ...state.slice(originalProtocolIndex + 1),
      ];

      return newState;
    }
    default:
      return state;
  }
}

const actionCreators = {
  createAndLoadProtocol: protocolsLock(createAndLoadProtocolThunk),
  saveAndBundleProtocol: protocolsLock(saveAndBundleThunk),
  unbundleAndLoadProtocol: protocolsLock(loadingLock(unbundleAndLoadThunk)),
  openProtocol: protocolsLock(openProtocol),
  saveCopy: protocolsLock(saveCopyThunk),
};

const actionTypes = {
  SAVE_AND_EXPORT_ERROR,
  UNBUNDLE_AND_LOAD_ERROR,
  CREATE_AND_LOAD_ERROR,
  OPEN_ERROR,
};

const actionLocks = {
  loading: loadingLock,
  protocols: protocolsLock,
  saving: savingLock,
};

export {
  actionCreators,
  actionTypes,
  actionLocks,
};

