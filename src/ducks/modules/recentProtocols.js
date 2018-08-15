import { existsSync } from 'fs';
import { compose } from 'recompose';
import { get, omit } from 'lodash';
import { uniqWith, slice } from 'lodash/fp';
import { REHYDRATE } from 'redux-persist/constants';
import { createProtocol, locateProtocol } from '../../other/protocols';
import { actionTypes as protocolFileActionTypes } from './protocol/file';
import history from '../../history';

const CLEAR_DEAD_LINKS = Symbol('PROTOCOLS/CLEAR_DEAD_LINKS');

const initialState = [];

const protocolExists = protocol => (
  existsSync(protocol.archivePath) ||
  (protocol.advanced && existsSync(protocol.workingPath))
);

const pruneProtocols = (protocol) => {
  if (protocol.advanced) {
    return omit(protocol, 'archivePath');
  }

  return omit(protocol, 'workingPath');
};

const optionalUnique = property =>
  (item, other) =>
    get(item, property, Symbol('ITEM')) === get(other, property, Symbol('OTHER'));

const recentUniqueProtocols = compose(
  slice(0, 10),
  uniqWith(optionalUnique('workingPath')),
  uniqWith(optionalUnique('archivePath')),
);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolFileActionTypes.PROTOCOL_LOADED:
      return recentUniqueProtocols(
        [action.meta].concat(state),
      );
    case CLEAR_DEAD_LINKS:
      return state.filter(protocolExists)
        .map(pruneProtocols);
    case REHYDRATE: {
      const protocols = get(action, ['payload', 'protocols'], []);

      return protocols
        .filter(protocolExists)
        .map(pruneProtocols);
    }
    default:
      return state;
  }
}

const clearDeadLinks = () =>
  ({
    type: CLEAR_DEAD_LINKS,
  });


const createProtocolAction = () =>
  () =>
    createProtocol()
      .then(
        (protocolMeta) => {
          history.push(`/edit/${encodeURIComponent(protocolMeta.archivePath)}`);
        },
      );

const chooseProtocolAction = () =>
  () =>
    locateProtocol()
      .then(
        (filePath) => {
          history.push(`/edit/${encodeURIComponent(filePath)}`);
        },
      );

const actionCreators = {
  clearDeadLinks,
  createProtocol: createProtocolAction,
  chooseProtocol: chooseProtocolAction,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

