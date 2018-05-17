import uuid from 'uuid';
import { existsSync } from 'fs';
import { uniqBy, get, has, omit } from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import { createProtocol, loadProtocolData, locateProtocol, openProtocol } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';

const UPDATE_PROTOCOL = Symbol('PROTOCOLS/UPDATE_PROTOCOL');
const ADD_PROTOCOL = Symbol('PROTOCOLS/ADD_PROTOCOL');
const CLEAR_DEAD_LINKS = Symbol('PROTOCOLS/CLEAR_DEAD_LINKS');

const initialState = [];

const archiveExists = protocol => existsSync(protocol.archivePath);
const pruneWorkingPath = protocol => omit(protocol, 'workingPath');

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PROTOCOL: {
      const newProtocols = [
        ...state,
        action.protocol,
      ];

      return uniqBy(newProtocols, 'archivePath')
        .slice(-10);
    }
    case UPDATE_PROTOCOL: {
      return state.map((protocol) => {
        if (protocol.id !== action.id) { return protocol; }
        return { ...protocol, ...action.protocol };
      });
    }
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

const addProtocol = protocol =>
  ({
    type: ADD_PROTOCOL,
    protocol: {
      ...protocol,
      id: uuid(),
    },
  });

const updateProtocol = (id, protocol) =>
  ({
    type: UPDATE_PROTOCOL,
    id,
    protocol,
  });

const clearDeadLinks = () =>
  ({
    type: CLEAR_DEAD_LINKS,
  });

const prepareWorkingCopy = (protocolMeta) => {
  if (has(protocolMeta, 'workingPath')) {
    return Promise.resolve(protocolMeta);
  }

  return openProtocol(protocolMeta.archivePath)
    .then(
      ({ workingPath }) =>
        ({ ...protocolMeta, workingPath }),
    );
};

const loadProtocolAction = protocolId =>
  (dispatch, getState) => {
    const { protocols } = getState();
    const protocolMeta = protocols.find(protocol => protocol.id === protocolId);

    return prepareWorkingCopy(protocolMeta)
      .then((protocolMetaWithWorkingPath) => {
        const protocolData = loadProtocolData(protocolMetaWithWorkingPath.workingPath);

        dispatch(updateProtocol(protocolMetaWithWorkingPath.id, protocolMetaWithWorkingPath));
        dispatch(protocolActions.setProtocol(protocolData, protocolMetaWithWorkingPath));
      });
  };

const createProtocolAction = (callback = () => {}) =>
  dispatch =>
    createProtocol()
      .then((protocolMeta) => {
        const action = addProtocol(protocolMeta);
        dispatch(action);
        callback(action.protocol);
      });

const chooseProtocolAction = (callback = () => {}) =>
  (dispatch, getState) =>
    locateProtocol()
      .then((archivePath) => {
        const { protocols } = getState();
        const existingEntry = protocols.find(protocol => protocol.archivePath === archivePath);

        if (existingEntry) {
          return callback(existingEntry);
        }

        const newProtocolAction = addProtocol({ archivePath });
        dispatch(newProtocolAction);
        return callback(newProtocolAction.protocol);
      });

const actionCreators = {
  addProtocol,
  updateProtocol,
  clearDeadLinks,
  createProtocol: createProtocolAction,
  loadProtocol: loadProtocolAction,
  chooseProtocol: chooseProtocolAction,
};

const actionTypes = {
  ADD_PROTOCOL,
};

export {
  actionCreators,
  actionTypes,
};

