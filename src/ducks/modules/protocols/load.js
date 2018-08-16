import { find } from 'lodash';
import { loadProtocolData } from '../../../other/protocols';
import history from '../../../history';

const LOAD_PROTOCOL = 'PROTOCOLS/LOAD';
const LOAD_PROTOCOL_SUCCESS = 'PROTOCOLS/LOAD_SUCCESS';
const LOAD_PROTOCOL_ERROR = 'PROTOCOLS/LOAD_ERROR';

export const loadProtocol = id => ({
  type: LOAD_PROTOCOL,
  id,
});

export const loadProtocolSuccess = (meta, protocol) => ({
  type: LOAD_PROTOCOL_SUCCESS,
  meta,
  protocol,
});

export const loadProtocolError = error =>
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
      return dispatch(loadProtocolError(`Protocol "${id}" not found in 'protocols'`));
    }

    return loadProtocolData(meta.workingPath)
      .then(protocolData => dispatch(loadProtocolSuccess(meta, protocolData)))
      .catch(error => dispatch(loadProtocolError(error)));
  };

const actionCreators = {
  loadProtocol: loadProtocolThunk,
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
