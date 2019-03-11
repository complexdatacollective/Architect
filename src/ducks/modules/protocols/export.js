import { find } from 'lodash';
import { bundleProtocol } from '../../../other/protocols';

const EXPORT_PROTOCOL = 'PROTOCOLS/EXPORT';
const EXPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/EXPORT_SUCCESS';
const EXPORT_PROTOCOL_ERROR = 'PROTOCOLS/EXPORT_ERROR';

const exportProtocol = () => ({ type: EXPORT_PROTOCOL });

const exportProtocolSuccess = filePath => ({
  type: EXPORT_PROTOCOL_SUCCESS,
  filePath,
});

const exportProtocolError = error => ({
  type: EXPORT_PROTOCOL_ERROR,
  error,
});

const exportProtocolThunk = () =>
  (dispatch, getState) => {
    dispatch(exportProtocol());
    const state = getState();
    const activeProtocolId = state.session.activeProtocol;
    const meta = find(state.protocols, ['id', activeProtocolId]);

    if (!meta) {
      // Always return a promise
      return Promise.resolve(dispatch(exportProtocolError(`Protocol "${activeProtocolId}" not found in 'protocols'`)));
    }

    return bundleProtocol(meta.workingPath, meta.filePath)
      .then(() => dispatch(exportProtocolSuccess(meta.filePath)))
      .catch(e => dispatch(exportProtocolError(e)));
  };

const actionCreators = {
  exportProtocol: exportProtocolThunk,
  exportProtocolSuccess,
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
