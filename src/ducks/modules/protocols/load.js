import { getProtocolMeta } from '@selectors/protocols';
import { loadProtocolConfiguration } from '@app/utils/protocols';
import history from '@app/history';
import { createLock } from '@modules/ui/status';
import { actionCreators as protocolActions } from '@modules/protocol/index';

const loadingLock = createLock('PROTOCOLS/LOADING');

const LOAD_PROTOCOL = 'PROTOCOLS/LOAD';
const LOAD_PROTOCOL_SUCCESS = 'PROTOCOLS/LOAD_SUCCESS';
const LOAD_PROTOCOL_ERROR = 'PROTOCOLS/LOAD_ERROR';

const loadProtocol = id => ({
  type: LOAD_PROTOCOL,
  id,
});

const loadProtocolSuccess = (meta, protocol) => ({
  type: LOAD_PROTOCOL_SUCCESS,
  meta,
  protocol,
  ipc: true,
});

const loadProtocolSuccessThunk = (meta, protocol) =>
  (dispatch) => {
    dispatch(loadProtocolSuccess(meta, protocol));
    dispatch(protocolActions.setProtocol(meta, protocol));
  };

const loadProtocolError = error =>
  (dispatch) => {
    dispatch({
      type: LOAD_PROTOCOL_ERROR,
      error,
    });

    history.push('/');
  };

const loadProtocolThunk = id =>
  (dispatch, getState) => {
    dispatch(loadProtocol(id));

    const state = getState();
    const meta = getProtocolMeta(state, id);

    if (!meta) {
      dispatch(loadProtocolError(`Protocol "${id}" not found in 'protocols'`));
      return Promise.resolve(); // Always return a promise
    }

    return loadProtocolConfiguration(meta.workingPath)
      .then(protocolData => dispatch(loadProtocolSuccessThunk(meta, protocolData)))
      .catch(error => dispatch(loadProtocolError(error)));
  };

const actionLocks = {
  loading: loadingLock,
};

const actionCreators = {
  loadProtocol: loadingLock(loadProtocolThunk),
  loadProtocolSuccess: loadProtocolSuccessThunk,
};

// Ideally this wouldn't be exported.
// Suggest refactoring to actionCreators and actionThunks?
const testing = {
  loadProtocolSuccess,
};

const actionTypes = {
  LOAD_PROTOCOL,
  LOAD_PROTOCOL_SUCCESS,
  LOAD_PROTOCOL_ERROR,
};

export {
  testing,
  actionLocks,
  actionCreators,
  actionTypes,
};
