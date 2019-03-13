import { actionCreators as createActionCreators } from './create';
import { actionCreators as importActionCreators } from './import';
import { actionCreators as saveActionCreators } from './save';
import { actionCreators as exportActionCreators } from './export';
import {
  actionCreators as registerActionCreators,
  actionTypes as registerActionTypes,
} from './register';
import openProtocolDialog from '../../../other/protocols/utils/openProtocolDialog';
import history from '../../../history';

const SAVE_AND_EXPORT_ERROR = 'PROTOCOLS/SAVE_AND_EXPORT_ERROR';
const IMPORT_AND_LOAD_ERROR = 'PROTOCOLS/IMPORT_AND_LOAD_ERROR';
const CREATE_AND_LOAD_ERROR = 'PROTOCOLS/CREATE_AND_LOAD_ERROR';
const OPEN_ERROR = 'PROTOCOLS/OPEN_ERROR';

const saveAndExportError = error => ({
  type: SAVE_AND_EXPORT_ERROR,
  error,
});

const importAndLoadError = error => ({
  type: IMPORT_AND_LOAD_ERROR,
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
const saveAndExportThunk = () =>
  dispatch =>
    dispatch(saveActionCreators.saveProtocol())
      .then(() => dispatch(exportActionCreators.exportProtocol()))
      .catch(e => dispatch(saveAndExportError(e)));

/**
 * 1. Import - extract/copy protocol to /tmp/{working-path}
 * 2. Load - redirect to /edit/ which should trigger load.
 */
const importAndLoadThunk = filePath =>
  dispatch =>
    dispatch(importActionCreators.importProtocol(filePath))
      .then(({ id }) => {
        history.push(`/edit/${id}/`);
        return id;
      })
      .catch(e => dispatch(importAndLoadError(e)));

/**
 * 1. Create - Create a new protocol from template
 * 2. Run importAndLoadThunk on new protocol
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
 * 2. Run importAndLoadThunk on specified path
 */
const openProtocol = () =>
  dispatch =>
    openProtocolDialog()
      .then(filePath => dispatch(importAndLoadThunk(filePath)))
      .catch(e => dispatch(openError(e)));

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
    default:
      return state;
  }
}

const actionCreators = {
  createAndLoadProtocol: createAndLoadProtocolThunk,
  saveAndExportProtocol: saveAndExportThunk,
  importAndLoadProtocol: importAndLoadThunk,
  openProtocol,
};

const actionTypes = {
  SAVE_AND_EXPORT_ERROR,
  IMPORT_AND_LOAD_ERROR,
  CREATE_AND_LOAD_ERROR,
  OPEN_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

