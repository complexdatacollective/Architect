import { saveProtocol, exportProtocol } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const SAVE_COMPLETE = Symbol('PROTOCOL/SAVE_COMPLETE');
const EXPORT_COMPLETE = Symbol('PROTOCOL/EXPORT_COMPLETE');

const saveComplete = () => ({ type: SAVE_COMPLETE });
const exportComplete = () => ({ type: EXPORT_COMPLETE });

const saveProtocolAction = () =>
  (dispatch, getState) => {
    const state = getState();
    const protocolPath = state.session.activeProtocol;
    const protocol = getProtocol(state);
    saveProtocol(protocolPath, protocol)
      .then(() => dispatch(saveComplete()));
  };

const exportProtocolAction = () =>
  (dispatch, getState) => {
    const state = getState();
    const protocolPath = state.session.activeProtocol;
    const protocol = getProtocol(state);
    saveProtocol(protocolPath, protocol)
      .then(() => dispatch(saveComplete()))
      .then(() => exportProtocol(protocolPath))
      .then(() => dispatch(exportComplete()));
  };


const actionCreators = {
  saveProtocol: saveProtocolAction,
  saveComplete,
  exportProtocol: exportProtocolAction,
  exportComplete,
};

const actionTypes = {
  SAVE_COMPLETE,
  EXPORT_COMPLETE,
};

export {
  actionCreators,
  actionTypes,
};
