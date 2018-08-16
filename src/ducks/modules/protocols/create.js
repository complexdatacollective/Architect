import createProtocolFile from '../../../other/protocols/createProtocol';

// const CREATE_PROTOCOL = 'PROTOCOLS/CREATE_PROTOCOL';
const CREATE_PROTOCOL_SUCCESS = 'PROTOCOLS/CREATE_PROTOCOL_SUCCESS';
const CREATE_PROTOCOL_ERROR = 'PROTOCOLS/CREATE_PROTOCOL_ERROR';

const createProtocolSuccess = filePath => ({
  type: CREATE_PROTOCOL_SUCCESS,
  filePath,
});

const createProtocolError = error => ({
  type: CREATE_PROTOCOL_ERROR,
  error,
});

const createProtocol = () =>
  dispatch =>
    createProtocolFile()
      .then(({ filePath }) => dispatch(createProtocolSuccess(filePath)))
      .catch(e => dispatch(createProtocolError(e)));

const actionCreators = {
  createProtocol,
};

const actionTypes = {
  CREATE_PROTOCOL_SUCCESS,
  CREATE_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

