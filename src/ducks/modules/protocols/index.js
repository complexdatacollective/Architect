/* eslint-disable */

import { existsSync } from 'fs';
import { uniqBy } from 'lodash';
import { createProtocol, loadProtocolData, locateProtocol, openProtocol } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as protocolsActions } from '../protocols';

const ADD_PROTOCOL_TO_INDEX = Symbol('PROTOCOLS/ADD_PROTOCOL_TO_INDEX');
const REMOVE_PROTOCOL_FROM_INDEX = Symbol('PROTOCOLS/REMOVE_PROTOCOL_FROM_INDEX');

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PROTOCOL_TO_INDEX:
      return uniqBy([
        ...state,
        action.protocol,
      ], 'archivePath').slice(-10);
    case REMOVE_PROTOCOL_FROM_INDEX:
      return state
        .filter(protocol => protocol.workingPath !== action.protocol.workingPath);
    default:
      return state;
  }
}

const addProtocolToIndex = protocol =>
  ({
    type: ADD_PROTOCOL_TO_INDEX,
    protocol,
  });

const removeProtocolFromIndex = protocol =>
  ({
    type: REMOVE_PROTOCOL_FROM_INDEX,
    protocol,
  });

const loadProtocolAction = path =>
  dispatch =>
    dispatch(protocolActions.setProtocol(loadProtocolData(path), path));

const createProtocolAction = (callback = () => {}) =>
  dispatch =>
    createProtocol()
      .then((protocolMeta) => {
        dispatch(protocolsActions.addProtocolToIndex(protocolMeta));
        callback(protocolMeta);
      });

const chooseProtocolAction = (callback = () => {}) =>
  dispatch =>
    locateProtocol()
      .then(openProtocol)
      .then((protocolMeta) => {
        dispatch(protocolsActions.addProtocolToIndex(protocolMeta));
        callback(protocolMeta);
      });

const clearDeadLinks = () =>
  (dispatch, getState) => {
    const { protocols } = getState();

    protocols
      .forEach(
        (protocol) => {
          if (!existsSync(protocol.archivePath) || !existsSync(protocol.workingPath)) {
            dispatch(removeProtocolFromIndex(protocol));
          }
        },
      );
  };

const actionCreators = {
  addProtocolToIndex,
  removeProtocolFromIndex,
  clearDeadLinks,
  createProtocol: createProtocolAction,
  loadProtocol: loadProtocolAction,
  chooseProtocol: chooseProtocolAction,
};

const actionTypes = {
  ADD_PROTOCOL_TO_INDEX,
};

export {
  actionCreators,
  actionTypes,
};

