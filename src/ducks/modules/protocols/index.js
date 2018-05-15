import uuid from 'uuid';
import { existsSync } from 'fs';
import { uniqBy, get, omit } from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import { createProtocol, locateProtocol, openProtocol } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as protocolsActions } from '../protocols';

const UPDATE_INDEX = Symbol('PROTOCOLS/UPDATE_INDEX');
const ADD_PROTOCOL_TO_INDEX = Symbol('PROTOCOLS/ADD_PROTOCOL_TO_INDEX');
const REMOVE_PROTOCOL_FROM_INDEX = Symbol('PROTOCOLS/REMOVE_PROTOCOL_FROM_INDEX');
const CLEAR_DEAD_LINKS = Symbol('PROTOCOLS/CLEAR_DEAD_LINKS');

const initialState = [];

const archiveExists = protocol => existsSync(protocol.archivePath);
const pruneWorkingPath = protocol => omit(protocol, 'workingPath');

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PROTOCOL_TO_INDEX: {
      const newProtocols = [
        ...state,
        action.protocol,
      ];

      return uniqBy(newProtocols, 'archivePath')
        .slice(-10);
    }
    case UPDATE_INDEX: {
      return state.map((protocol) => {
        if (protocol.id != action.id) { return protocol; }
        return { ...protocol, ...action.protocol };
      });
    }
    case REMOVE_PROTOCOL_FROM_INDEX:
      return state
        .filter(protocol => protocol.id !== action.id);
    case CLEAR_DEAD_LINKS:
      return state.filter(archiveExists);
    case REHYDRATE: {
      const protocols = get(action, ['payload', 'protocols'], []);

      return protocols
        .filter(archiveExists)
        .map(pruneWorkingPath);
    }
    default:
      return state;
  }
}

const addProtocolToIndex = protocol =>
  ({
    type: ADD_PROTOCOL_TO_INDEX,
    protocol: {
      ...protocol,
      id: uuid(),
    },
  });

const updateIndex = (id, protocol) =>
  ({
    type: UPDATE_INDEX,
    id,
    protocol,
  });

const removeProtocolFromIndex = id =>
  ({
    type: REMOVE_PROTOCOL_FROM_INDEX,
    id,
  });

const clearDeadLinks = () =>
  ({
    type: CLEAR_DEAD_LINKS,
  });

// TODO: Move getState dependent logic into reducers?
const loadProtocolAction = protocolId =>
  (dispatch, getState) => {
    const { protocols } = getState();
    const protocolMeta = protocols.find(protocol => protocol.id === protocolId);

    if (protocolMeta.workingPath) {
      dispatch(protocolActions.loadProtocol(protocolMeta));
      return;
    }

    openProtocol(protocolMeta.archivePath)
      .then(({ workingPath }) => {
        const newProtocolMeta = { ...protocolMeta, workingPath };
        dispatch(updateIndex(protocolMeta.id, newProtocolMeta));
        dispatch(protocolActions.loadProtocol(newProtocolMeta));
      });
  };

const createProtocolAction = (callback = () => {}) =>
  dispatch =>
    createProtocol()
      .then((protocolMeta) => {
        const action = protocolsActions.addProtocolToIndex(protocolMeta);
        dispatch(action);
        callback(action.protocol);
      });

const chooseProtocolAction = (callback = () => {}) =>
  (dispatch, getState) =>
    locateProtocol()
      .then((archivePath) => {
        const { protocols } = getState();
        const existingEntry = protocols.find(protocol => protocol.archivePath === archivePath);
        if (existingEntry) { return existingEntry; }
        return { archivePath };
      })
      .then((protocolMeta) => {
        const action = protocolsActions.addProtocolToIndex(protocolMeta);
        dispatch(action);
        callback(action.protocol);
      });

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

