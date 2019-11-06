import { getActiveProtocolId, getActiveProtocolMeta } from '@selectors/protocols';
import bundleProtocol from '@app/other/protocols/bundleProtocol';

const BUNDLE_PROTOCOL = 'PROTOCOLS/BUNDLE';
const BUNDLE_PROTOCOL_SUCCESS = 'PROTOCOLS/BUNDLE_SUCCESS';
const BUNDLE_PROTOCOL_ERROR = 'PROTOCOLS/BUNDLE_ERROR';

const bundleProtocolAction = () => ({ type: BUNDLE_PROTOCOL });

const bundleProtocolSuccess = filePath => ({
  type: BUNDLE_PROTOCOL_SUCCESS,
  filePath,
});

const bundleProtocolError = error => ({
  type: BUNDLE_PROTOCOL_ERROR,
  error,
});

const bundleProtocolThunk = () =>
  (dispatch, getState) => {
    dispatch(bundleProtocolAction());
    const state = getState();
    const meta = getActiveProtocolMeta(state);
    const activeProtocolId = getActiveProtocolId(state);

    if (!meta) {
      // Always return a promise
      return Promise.resolve(dispatch(bundleProtocolError(`Protocol "${activeProtocolId}" not found in 'protocols'`)));
    }

    return bundleProtocol(meta.workingPath, meta.filePath)
      .then(() => dispatch(bundleProtocolSuccess(meta.filePath)))
      .catch(e => dispatch(bundleProtocolError(e)));
  };

const actionCreators = {
  bundleProtocol: bundleProtocolThunk,
  bundleProtocolSuccess,
};

const actionTypes = {
  BUNDLE_PROTOCOL,
  BUNDLE_PROTOCOL_SUCCESS,
  BUNDLE_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};
