import { createProtocol as createProtocolFile } from '@app/utils/protocols';

const CREATE_PROTOCOL = 'PROTOCOLS/CREATE_PROTOCOL';
const CREATE_PROTOCOL_SUCCESS = 'PROTOCOLS/CREATE_PROTOCOL_SUCCESS';
const CREATE_PROTOCOL_ERROR = 'PROTOCOLS/CREATE_PROTOCOL_ERROR';

const createProtocol = () => ({ type: CREATE_PROTOCOL });

const createProtocolSuccess = (filePath, workingPath) => ({
  type: CREATE_PROTOCOL_SUCCESS,
  filePath,
  workingPath,
});

const createProtocolError = error => ({
  type: CREATE_PROTOCOL_ERROR,
  error,
});

const createProtocolThunk = () =>
  (dispatch) => {
    dispatch(createProtocol());

    return createProtocolFile()
      .then(({ filePath, workingPath }) => {
        dispatch(createProtocolSuccess(filePath, workingPath));

        return { filePath, workingPath };
      })
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

