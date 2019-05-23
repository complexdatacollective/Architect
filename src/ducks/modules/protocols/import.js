import unbundleProtocol from '../../../other/protocols/unbundleProtocol';
import { loadProtocolConfiguration } from '../../../other/protocols';
import { actionCreators as registerActions } from './register';
import validateProtocol from '../../../utils/validateProtocol';

const IMPORT_PROTOCOL = 'PROTOCOLS/IMPORT';
const IMPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/IMPORT_SUCCESS';
const IMPORT_PROTOCOL_ERROR = 'PROTOCOLS/IMPORT_ERROR';

const importProtocol = filePath => ({
  type: IMPORT_PROTOCOL,
  filePath,
});

const importProtocolSuccess = ({ filePath, workingPath }) => ({
  type: IMPORT_PROTOCOL_SUCCESS,
  filePath,
  workingPath,
});

const importProtocolError = (error, filePath) => ({
  type: IMPORT_PROTOCOL_ERROR,
  filePath,
  error,
});

const importProtocolThunk = filePath =>
  (dispatch) => {
    dispatch(importProtocol(filePath));

    return unbundleProtocol(filePath)
      .then(workingPath =>
        // check we can open the protocol file
        loadProtocolConfiguration(workingPath)
          // .then((protocol) => { console.log(protocol); return protocol; })
          // it loaded okay, check the protocol is valid
          .then(validateProtocol)
          .then(() => {
            // all was well
            dispatch(importProtocolSuccess({ filePath, workingPath }));
            return dispatch(registerActions.registerProtocol({ filePath, workingPath }));
          }),
      )
      .catch((e) => {
        dispatch(importProtocolError(e, filePath));

        throw e;
      });
  };

const actionCreators = {
  importProtocol: importProtocolThunk,
  importProtocolSuccess,
  importProtocolError,
};

const actionTypes = {
  IMPORT_PROTOCOL,
  IMPORT_PROTOCOL_SUCCESS,
  IMPORT_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

