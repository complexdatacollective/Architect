import uuid from 'uuid';
import path from 'path';
import importProtocolFiles from '../../../other/protocols/importProtocol';

// const IMPORT_PROTOCOL = 'PROTOCOLS/IMPORT_PROTOCOL';
const IMPORT_PROTOCOL_SUCCESS = 'PROTOCOLS/IMPORT_PROTOCOL_SUCCESS';
const IMPORT_PROTOCOL_ERROR = 'PROTOCOLS/IMPORT_PROTOCOL_ERROR';

const isNetcanvasFile = fileName =>
  path.extname(fileName) === '.netcanvas';

const getMeta = (filePath, isAdvanced = false) => ({
  filePath,
  id: uuid(),
  advanced: isAdvanced,
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

const importProtocol = filePath =>
  (dispatch) => {
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
  importProtocol,
};

const actionTypes = {
  IMPORT_PROTOCOL_SUCCESS,
  IMPORT_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};

