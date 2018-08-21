import { createProtocol as createProtocolFile } from '../../../other/protocols';

const CREATE_PROTOCOL = 'PROTOCOLS/CREATE_PROTOCOL';
const CREATE_PROTOCOL_SUCCESS = 'PROTOCOLS/CREATE_PROTOCOL_SUCCESS';
const CREATE_PROTOCOL_ERROR = 'PROTOCOLS/CREATE_PROTOCOL_ERROR';

const createProtocol = () => ({ type: CREATE_PROTOCOL });

const createProtocolSuccess = filePath => ({
  type: CREATE_PROTOCOL_SUCCESS,
  filePath,
});

const createProtocolError = error => ({
  type: CREATE_PROTOCOL_ERROR,
  error,
});

const createProtocolThunk = () =>
  (dispatch) => {
    dispatch(createProtocol());

    return createProtocolFile()
      .then(filePath => dispatch(createProtocolSuccess(filePath)))
      .catch(e => dispatch(createProtocolError(e)));
  };

const actionCreators = {
  createProtocol: createProtocolThunk,
};

const actionTypes = {
  CREATE_PROTOCOL_SUCCESS,
  CREATE_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

