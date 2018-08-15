import { find } from 'lodash';
import { loadProtocolData } from '../../../other/protocols';

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

export const loadProtocolError = error => ({
  type: LOAD_PROTOCOL_ERROR,
  error,
});

const loadProtocolThunk = id =>
  (dispatch, getState) => {
    dispatch(loadProtocol(id)); // is this necessary?
    const state = getState();

    const meta = find(state.protocols, ['id', id]);

    loadProtocolData(meta.filePath)
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
