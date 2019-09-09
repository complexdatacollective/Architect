import log from 'electron-log';
import unbundleProtocol from '../../../other/protocols/unbundleProtocol';
import { loadProtocolConfiguration } from '../../../other/protocols';
import { actionCreators as registerActions } from './register';
import validateProtocol from '../../../utils/validateProtocol';
// import migrateProtocol from '../../../protocol-validation/migrations/migrateProtocol';
import { validationErrorDialog, migrateSchemaDialog } from './dialogs';

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
          // it loaded okay, check the protocol is valid
          .then((protocol) => {
            // We don't actually want to stop the protocol from being
            // imported for a validation error, so this is separate
            // from the loading logic
            validateProtocol(protocol)
              .catch((e) => {
                dispatch(validationErrorDialog(e, filePath));
              });

            // Next, check the schema version, and migrate if required.
            const ARCHITECT_SCHEMA_VERSION = 2;

            if (parseInt(protocol.schemaVersion, 10) < ARCHITECT_SCHEMA_VERSION) {
              log.error('schema needs updating');
              log.error(protocol.schemaVersion);
              dispatch(migrateSchemaDialog(
                () => console.log('you did it'),
              ));

              // migrateProtocol(protocol, ARCHITECT_SCHEMA_VERSION)
              // .catch((e) => {
              //   dispatch(migrationErrorDialog(e, filePath));
              // });
            } else {
              log.error('schema version okay');
              log.error(protocol.schemaVersion);
            }

            return protocol;
          })
          .then(() => {
            // all was well with the world. for now.
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

