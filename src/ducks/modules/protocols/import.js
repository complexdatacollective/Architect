import uuid from 'uuid';
import path from 'path';
import { importProtocol as importProtocolFiles } from '../../../other/protocols';

const IMPORT_PROTOCOL = 'PROTOCOLS/IMPORT';
const IMPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/IMPORT_SUCCESS';
const IMPORT_PROTOCOL_ERROR = 'PROTOCOLS/IMPORT_ERROR';

const isNetcanvasFile = fileName =>
  path.extname(fileName) === '.netcanvas';

const getMeta = (filePath, isAdvanced = false) => ({
  filePath,
  id: uuid(),
  advanced: isAdvanced,
});

const importProtocol = filePath => ({
  type: IMPORT_PROTOCOL,
  filePath,
});

const importProtocolSuccess = ({ filePath, id, advanced, workingPath }) => ({
  type: IMPORT_PROTOCOL_SUCCESS,
  filePath,
  id,
  advanced,
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

    const protocolMeta = getMeta(
      filePath,
      !isNetcanvasFile(filePath),
    );

    return importProtocolFiles(filePath)
      .then(workingPath => ({ ...protocolMeta, workingPath }))
      .then(metaWithWorkingPath => dispatch(importProtocolSuccess(metaWithWorkingPath)))
      .catch(e => dispatch(importProtocolError(e, filePath)));
  };

const actionCreators = {
  importProtocol: importProtocolThunk,
  importProtocolSuccess,
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

