import { find } from 'lodash';
import exportProtocolFile from '../../../other/protocols/exportProtocol';

const EXPORT_PROTOCOL = 'PROTOCOLS/EXPORT';
const EXPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/EXPORT_SUCCESS';
const EXPORT_PROTOCOL_ERROR = 'PROTOCOLS/EXPORT_ERROR';

export const exportProtocol = () => ({ type: EXPORT_PROTOCOL });

export const exportProtocolSuccess = filePath => ({
  type: EXPORT_PROTOCOL_SUCCESS,
  filePath,
});

export const exportProtocolError = error => ({
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
      return dispatch(exportProtocolError(`Protocol "${activeProtocolId}" not found in 'protocols'`));
    }

    return exportProtocolFile(meta.workingPath, meta.filePath)
      .then(() => dispatch(exportProtocolSuccess(meta.filePath)))
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
