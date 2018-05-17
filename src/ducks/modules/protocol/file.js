import { saveProtocol } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const SAVE_COMPLETE = Symbol('PROTOCOL/SAVE_COMPLETE');

const saveComplete = () => ({ type: SAVE_COMPLETE });

const saveProtocolAction = () =>
  (dispatch, getState) => {
    const state = getState();
    const activeProtocol = state.session.activeProtocol;
    const protocol = getProtocol(state);
    saveProtocol(activeProtocol, protocol)
      .then(() => dispatch(saveComplete()));
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
