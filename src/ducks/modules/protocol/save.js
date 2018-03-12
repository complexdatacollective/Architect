import { saveProtocol } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const SAVE_COMPLETE = Symbol('PROTOCOL/SAVE_COMPLETE');

const saveComplete = lastSaved => ({ type: SAVE_COMPLETE, lastSaved });

const saveProtocolAction = () =>
  (dispatch, getState) => {
    const state = getState();
    const protocolPath = state.session.activeProtocol;
    const protocol = getProtocol(state);
    saveProtocol(protocolPath, protocol)
      .then(() => dispatch(saveComplete(state.protocol.past.length)));
  };

const actionCreators = {
  saveProtocol: saveProtocolAction,
  saveComplete,
};

const actionTypes = {
  SAVE_COMPLETE,
};

export {
  actionCreators,
  actionTypes,
};
