import { createProtocol, loadProtocolData, locateProtocol } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as protocolsActions } from '../protocols';

const ADD_PROTOCOL_TO_DASHBOARD = Symbol('PROTOCOLS/ADD_PROTOCOL_TO_DASHBOARD');

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PROTOCOL_TO_DASHBOARD:
      return [
        ...state,
        action.protocol,
      ].slice(-3);
    default:
      return state;
  }
}

const addProtocolToDashboard = path =>
  ({
    type: ADD_PROTOCOL_TO_DASHBOARD,
    protocol: { path },
  });

const createProtocolAction = () =>
  dispatch =>
    createProtocol()
      .then(protocolPath =>
        dispatch(protocolsActions.addProtocolToDashboard(protocolPath)));

const loadProtocolAction = path =>
  dispatch =>
    dispatch(protocolActions.setProtocol(loadProtocolData(path), path));

const locateAndLoadProtocolAction = () =>
  dispatch =>
    locateProtocol()
      .then(protocolPath =>
        dispatch(loadProtocolAction(protocolPath)));

const actionCreators = {
  addProtocolToDashboard,
  createProtocol: createProtocolAction,
  loadProtocol: loadProtocolAction,
  locateAndLoadProtocol: locateAndLoadProtocolAction,
};

const actionTypes = {
  ADD_PROTOCOL_TO_DASHBOARD,
};

export {
  actionCreators,
  actionTypes,
};
