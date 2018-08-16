import { actionCreators as createActionCreators } from './create';
import {
  actionCreators as importActionCreators,
  actionTypes as importActionTypes,
} from './import';
import { actionCreators as saveActionCreators } from './save';
import { actionCreators as exportActionCreators } from './export';
import locateProtocol from '../../../other/protocols/locateProtocol';
import history from '../../../history';

const SAVE_AND_EXPORT = 'PROTOCOLS/SAVE_AND_EXPORT';
const SAVE_AND_EXPORT_SUCCESS = 'PROTOCOLS/SAVE_AND_EXPORT_SUCCESS';
const SAVE_AND_EXPORT_ERROR = 'PROTOCOLS/SAVE_AND_EXPORT_ERROR';

const IMPORT_AND_LOAD = 'PROTOCOLS/IMPORT_AND_LOAD';
const IMPORT_AND_LOAD_SUCCESS = 'PROTOCOLS/IMPORT_AND_LOAD_SUCCESS';
const IMPORT_AND_LOAD_ERROR = 'PROTOCOLS/IMPORT_AND_LOAD_ERROR';

const OPEN_ERROR = 'PROTOCOLS/OPEN_ERROR';

const saveAndExport = () => ({
  type: SAVE_AND_EXPORT,
});

const saveAndExportSuccess = () => ({
  type: SAVE_AND_EXPORT_SUCCESS,
});

const saveAndExportError = error => ({
  type: SAVE_AND_EXPORT_ERROR,
  error,
});

const importAndLoad = filePath => ({
  type: IMPORT_AND_LOAD,
  filePath,
});

const importAndLoadSuccess = id => ({
  type: IMPORT_AND_LOAD_SUCCESS,
  id,
});

const importAndLoadError = error => ({
  type: IMPORT_AND_LOAD_ERROR,
  error,
});

const openError = error => ({
  type: OPEN_ERROR,
  error,
});

const saveAndExportThunk = () =>
  (dispatch) => {
    dispatch(saveAndExport());
    dispatch(saveActionCreators.saveProtocol())
      .then(() => dispatch(exportActionCreators.exportProtocol()))
      .then(() => dispatch(saveAndExportSuccess()))
      .catch(e => dispatch(saveAndExportError(e)));
  };

const importAndLoadThunk = filePath =>
  (dispatch) => {
    dispatch(importAndLoad(filePath));
    dispatch(importActionCreators.importProtocol(filePath))
      .then(({ id }) => {
        history.push(`/edit/${id}/`);
        return dispatch(importAndLoadSuccess(id));
      })
      .catch(e => dispatch(importAndLoadError(e)));
  };

const createAndLoadProtocolThunk = () =>
  dispatch =>
    dispatch(createActionCreators.createProtocol())
      .then(({ filePath }) => dispatch(importAndLoadThunk(filePath)))
      .catch(e => dispatch(openError(e)));

const openProtocol = () =>
  dispatch =>
    locateProtocol()
      .then(filePath => dispatch(importAndLoadThunk(filePath)))
      .catch(e => dispatch(openError(e)));

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case importActionTypes.IMPORT_PROTOCOL_SUCCESS:
      return [
        ...state,
        {
          filePath: action.filePath,
          id: action.id,
          advanced: action.advanced,
          workingPath: action.workingPath,
        },
      ];
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
  SAVE_AND_EXPORT,
  SAVE_AND_EXPORT_SUCCESS,
  SAVE_AND_EXPORT_ERROR,
  IMPORT_AND_LOAD,
  IMPORT_AND_LOAD_SUCCESS,
  IMPORT_AND_LOAD_ERROR,
  OPEN_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

