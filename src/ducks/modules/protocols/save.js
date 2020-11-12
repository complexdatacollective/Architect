import { getActiveProtocolMeta } from '@selectors/protocols';
import { getProtocol } from '@selectors/protocol';
import { saveProtocol as saveProtocolFile } from '@app/utils/protocols';
import validateProtocol from '@app/utils/validateProtocol';
import { validationErrorDialog } from './dialogs';

const SAVE_PROTOCOL = 'PROTOCOLS/SAVE';
const SAVE_PROTOCOL_SUCCESS = 'PROTOCOLS/SAVE_SUCCESS';
const SAVE_PROTOCOL_ERROR = 'PROTOCOLS/SAVE_ERROR';

const saveProtocol = () => ({ type: SAVE_PROTOCOL });

const saveProtocolSuccess = (destinationPath, protocol, meta) => ({
  type: SAVE_PROTOCOL_SUCCESS,
  destinationPath,
  protocol,
  meta,
});

const saveProtocolError = error => ({
  type: SAVE_PROTOCOL_ERROR,
  error,
});

const saveProtocolThunk = () =>
  (dispatch, getState) => {
    dispatch(saveProtocol());
    const state = getState();
    const meta = getActiveProtocolMeta(state);
    const protocol = getProtocol(state);

    protocol.lastModified = new Date().toJSON();

    if (!meta) {
      // Always return a promise
      dispatch(saveProtocolError('No active protocol found'));
      return Promise.resolve();
    }

    return validateProtocol(protocol)
      // We don't actually want to stop the protocol from being
      // saved for a validation error
      .catch((e) => {
        dispatch(validationErrorDialog(e));
      })
      .then(() => saveProtocolFile(meta.workingPath, protocol))
      .then(destinationPath => dispatch(saveProtocolSuccess(destinationPath, protocol, meta)))
      .catch((e) => {
        dispatch(saveProtocolError(e));
        throw e;
      });
  };

const actionCreators = {
  saveProtocol: saveProtocolThunk,
};

const actionTypes = {
  SAVE_PROTOCOL,
  SAVE_PROTOCOL_SUCCESS,
  SAVE_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};
