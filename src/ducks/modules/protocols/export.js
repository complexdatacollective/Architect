import exportProtocolFile from '../../../other/protocols/exportProtocol';

const EXPORT_PROTOCOL = 'PROTOCOLS/EXPORT';
const EXPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/EXPORT_SUCCESS';
const EXPORT_PROTOCOL_ERROR = 'PROTOCOLS/EXPORT_ERROR';

export const exportProtocol = () => ({ type: EXPORT_PROTOCOL });

export const exportProtocolSuccess = () => ({ type: EXPORT_PROTOCOL_SUCCESS });

export const exportProtocolError = error => ({
  type: EXPORT_PROTOCOL_ERROR,
  error,
});

const exportProtocolThunk = () =>
  (dispatch, getState) => {
    dispatch(exportProtocol());
    const state = getState();
    const activeProtocol = state.session.activeProtocol;

    return exportProtocolFile(activeProtocol)
      .then(() => dispatch(exportProtocolSuccess()))
      .catch(e => dispatch(exportProtocolError(e)));
  };

const actionCreators = {
  exportProtocol: exportProtocolThunk,
};

const actionTypes = {
  EXPORT_PROTOCOL,
  EXPORT_PROTOCOL_SUCCESS,
  EXPORT_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};
