import { find } from 'lodash';
import { loadProtocolConfiguration } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';
import history from '../../../history';

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
    const meta = find(state.protocols, ['id', id]);

    if (!meta) {
      dispatch(loadProtocolError(`Protocol "${id}" not found in 'protocols'`));
      return Promise.resolve(); // Always return a promise
    }

    return loadProtocolConfiguration(meta.workingPath)
      .then(protocolData => dispatch(loadProtocolSuccessThunk(meta, protocolData)))
      .catch(error => dispatch(loadProtocolError(error)));
  };

const actionCreators = {
  loadProtocol: loadProtocolThunk,
  loadProtocolSuccess: loadProtocolSuccessThunk,
};

const actionTypes = {
  LOAD_PROTOCOL,
  LOAD_PROTOCOL_SUCCESS,
  LOAD_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};
