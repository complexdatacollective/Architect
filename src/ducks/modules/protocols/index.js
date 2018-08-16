import { importProtocol } from './import';
import { createProtocol } from './create';
import { saveProtocol } from './save';
import { exportProtocol } from './export';

const SAVE_AND_EXPORT = 'PROTOCOLS/SAVE_AND_EXPORT';
const SAVE_AND_EXPORT_SUCCESS = 'PROTOCOLS/SAVE_AND_EXPORT_SUCCESS';
const SAVE_AND_EXPORT_ERROR = 'PROTOCOLS/SAVE_AND_EXPORT_ERROR';

const saveAndExportProtocol = () => ({
  type: SAVE_AND_EXPORT,
});

const saveAndExportProtocolSuccess = () => ({
  type: SAVE_AND_EXPORT_SUCCESS,
});

const saveAndExportProtocolError = error => ({
  type: SAVE_AND_EXPORT_ERROR,
  error,
});

const saveAndExportProtocolThunk = () =>
  (dispatch) => {
    dispatch(saveAndExportProtocol())
      .then(() => dispatch(saveProtocol()))
      .then(() => dispatch(exportProtocol()))
      .then(() => dispatch(saveAndExportProtocolSuccess()))
      .catch(e => dispatch(saveAndExportProtocolError(e)));
  };

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

const actionCreators = {
  importProtocol,
  createProtocol,
  saveAndExportProtocol: saveAndExportProtocolThunk,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

