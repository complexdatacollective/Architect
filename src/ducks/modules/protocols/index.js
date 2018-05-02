import { existsSync } from 'fs';
import { uniqBy } from 'lodash';
import { createProtocol, loadProtocolData, locateProtocol } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as protocolsActions } from '../protocols';

const ADD_PROTOCOL_TO_DASHBOARD = Symbol('PROTOCOLS/ADD_PROTOCOL_TO_DASHBOARD');
const REMOVE_PROTOCOL_FROM_DASHBOARD = Symbol('PROTOCOLS/REMOVE_PROTOCOL_FROM_DASHBOARD');

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PROTOCOL_TO_DASHBOARD:
      return uniqBy([
        ...state,
        action.protocol,
      ], 'path').slice(-10);
    case REMOVE_PROTOCOL_FROM_DASHBOARD:
      return state
        .filter(protocol => protocol.path !== action.protocol.path);
    default:
      return state;
  }
}

const addProtocolToDashboard = path =>
  ({
    type: ADD_PROTOCOL_TO_DASHBOARD,
    protocol: { path },
  });

const removeProtocolFromDashboard = path =>
  ({
    type: REMOVE_PROTOCOL_FROM_DASHBOARD,
    protocol: { path },
  });

const loadProtocolAction = path =>
  dispatch =>
    dispatch(protocolActions.setProtocol(loadProtocolData(path), path));

const createProtocolAction = (callback = () => {}) =>
  dispatch =>
    createProtocol()
      .then((protocolPath) => {
        dispatch(protocolsActions.addProtocolToDashboard(protocolPath));
        callback(protocolPath);
      });

const chooseProtocolAction = (callback = () => {}) =>
  dispatch =>
    locateProtocol()
      .then((protocolPath) => {
        dispatch(protocolsActions.addProtocolToDashboard(protocolPath));
        callback(protocolPath);
      });

const clearDeadLinks = () =>
  (dispatch, getState) => {
    const { protocols } = getState();

    protocols
      .forEach(
        (protocol) => {
          if (!existsSync(protocol.path)) {
            dispatch(removeProtocolFromDashboard(protocol.path));
          }
        },
      );
  };

const actionCreators = {
  addProtocolToDashboard,
  removeProtocolFromDashboard,
  clearDeadLinks,
  createProtocol: createProtocolAction,
  loadProtocol: loadProtocolAction,
  chooseProtocol: chooseProtocolAction,
};

const actionTypes = {
  ADD_PROTOCOL_TO_DASHBOARD,
};

export {
  actionCreators,
  actionTypes,
};

