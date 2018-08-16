import { actionCreators as createActionCreators } from './create';
import { actionCreators as importActionCreators } from './import';
import { actionCreators as loadActionCreators } from './load';
import { actionCreators as saveActionCreators } from './save';
import { actionCreators as exportActionCreators } from './export';

const SAVE_AND_EXPORT = 'PROTOCOLS/SAVE_AND_EXPORT';
const SAVE_AND_EXPORT_SUCCESS = 'PROTOCOLS/SAVE_AND_EXPORT_SUCCESS';
const SAVE_AND_EXPORT_ERROR = 'PROTOCOLS/SAVE_AND_EXPORT_ERROR';

const IMPORT_AND_LOAD = 'PROTOCOLS/IMPORT_AND_LOAD';
const IMPORT_AND_LOAD_SUCCESS = 'PROTOCOLS/IMPORT_AND_LOAD_SUCCESS';
const IMPORT_AND_LOAD_ERROR = 'PROTOCOLS/IMPORT_AND_LOAD_ERROR';

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

const importAndLoadSuccess = meta => ({
  type: IMPORT_AND_LOAD_SUCCESS,
  meta,
});

const importAndLoadError = error => ({
  type: IMPORT_AND_LOAD_ERROR,
  error,
});

const saveAndExportThunk = () =>
  dispatch =>
    dispatch(saveAndExport())
      .then(() => dispatch(saveActionCreators.saveProtocol()))
      .then(() => dispatch(exportActionCreators.exportProtocol()))
      .then(() => dispatch(saveAndExportSuccess()))
      .catch(e => dispatch(saveAndExportError(e)));

const importAndLoadThunk = filePath =>
  dispatch =>
    dispatch(importAndLoad(filePath))
      .then(() => dispatch(importActionCreators.importProtocol(filePath)))
      .then(meta =>
        dispatch(loadActionCreators.loadProtocol(meta.id))
          .then(() => dispatch(importAndLoadSuccess(meta))),
      )
      .catch(e => dispatch(importAndLoadError(e)));

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

const actionCreators = {
  createProtocol: createActionCreators.createProtocol,
  saveAndExportProtocol: saveAndExportThunk,
  importAndLoadProtocol: importAndLoadThunk,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

