import uuid from 'uuid';
import path from 'path';
import { importProtocol as importFiles } from '../../../other/protocols';

const IMPORT_PROTOCOL = 'PROTOCOLS/IMPORT_PROTOCOL';
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
  filePath,
  id,
  advanced,
  workingPath,
});

const importProtocolError = ({ filePath, error }) => ({
  filePath,
  error,
});

const importProtocol = filePath =>
  (dispatch) => {
    const protocolMeta = getMeta(
      filePath,
      isNetcanvasFile(filePath),
    );

    return importFiles(filePath)
      .then(workingPath => ({ ...protocolMeta, workingPath }))
      .then(metaWithWorkingPath => dispatch(importProtocolSuccess(metaWithWorkingPath)))
      .catch(
        e =>
          dispatch(importProtocolError({
            filePath,
            error: e,
          })),
      );
  };

const actionCreators = {
  importProtocol,
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

