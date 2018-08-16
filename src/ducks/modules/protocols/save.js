import { find } from 'lodash';
import { saveProtocol as saveProtocolFile } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const SAVE_PROTOCOL = 'PROTOCOLS/SAVE';
const SAVE_PROTOCOL_SUCCESS = 'PROTOCOLS/SAVE_SUCCESS';
const SAVE_PROTOCOL_ERROR = 'PROTOCOLS/SAVE_ERROR';

export const saveProtocol = () => ({ type: SAVE_PROTOCOL });

export const saveProtocolSuccess = (destinationPath, protocol) => ({
  type: SAVE_PROTOCOL_SUCCESS,
  destinationPath,
  protocol,
});

export const saveProtocolError = error => ({
  type: SAVE_PROTOCOL_ERROR,
  error,
});

const saveProtocolThunk = () =>
  (dispatch, getState) => {
    dispatch(saveProtocol());
    const state = getState();
    const activeProtocolId = state.session.activeProtocol;
    const meta = find(state.protocols, ['id', activeProtocolId]);
    const protocol = getProtocol(state);

    return saveProtocolFile(meta.workingPath, protocol)
      .then(destinationPath => dispatch(saveProtocolSuccess(destinationPath, protocol)))
      .catch(e => dispatch(saveProtocolError(e)));
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
