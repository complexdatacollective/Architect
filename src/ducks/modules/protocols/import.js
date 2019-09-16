import checkSupport from '@app/protocol-validation/validation/checkSupport';
import unbundleProtocol from '../../../other/protocols/unbundleProtocol';
import { loadProtocolConfiguration } from '../../../other/protocols';
import { actionCreators as registerActions } from './register';
import validateProtocol from '../../../utils/validateProtocol';
import { validationErrorDialog } from './dialogs';
import { SCHEMA_VERSION } from '../../../config';

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

const versionMatchWorkflow = (dispatch, { protocol, filePath, workingPath }) =>
  validateProtocol(protocol)
    // We don't actually want to stop the protocol from being
    // imported for a validation error, so this is separate
    // from the loading logic
    .catch((e) => {
      dispatch(validationErrorDialog(e, filePath));
    })
    .then(() => {
      // all was well
      dispatch(importProtocolSuccess({ filePath, workingPath }));
      return dispatch(registerActions.registerProtocol({ filePath, workingPath }));
    });

const upgradeWorkflow = ({ filePath }) =>
  dispatch =>
    dispatch(upgradeAppDialog(filePath));

const importProtocolThunk = filePath =>
  (dispatch) => {
    dispatch(importProtocol(filePath));

    return unbundleProtocol(filePath)
      .then(workingPath =>
        loadProtocolConfiguration(workingPath)
          .then((protocol) => {
            // If the schema version is higher than the app
            if (protocol.schemaVersion > SCHEMA_VERSION) {

              // show a notice to the user about upgrading
              return upgradeWorkflow({ filePath });
            }
            if (protocol.schemaVersion < SCHEMA_VERSION) {
              // check migrate, confirm dialog
            }

            return versionMatchWorkflow(dispatch, { protocol, filePath, workingPath });
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

