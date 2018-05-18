import { existsSync } from 'fs';
import { compose } from 'recompose';
import { get, omit } from 'lodash';
import { uniqBy, slice } from 'lodash/fp';
import { REHYDRATE } from 'redux-persist/constants';
import { createProtocol, locateProtocol } from '../../../other/protocols';
import { actionTypes as protocolFileActionTypes } from '../protocol/file';
import history from '../../../history';

const CLEAR_DEAD_LINKS = Symbol('PROTOCOLS/CLEAR_DEAD_LINKS');

const initialState = [];

const archiveExists = protocol => existsSync(protocol.archivePath);
const pruneWorkingPath = protocol => omit(protocol, 'workingPath');
const recentUniqueProtocols = compose(
  slice(0, 10),
  uniqBy('workingPath'),
  uniqBy('archivePath'),
);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolFileActionTypes.PROTOCOL_LOADED:
      return recentUniqueProtocols(
        [action.meta].concat(state),
      );
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

const clearDeadLinks = () =>
  ({
    type: CLEAR_DEAD_LINKS,
  });


const createProtocolAction = () =>
  () =>
    createProtocol()
      .then(
        (protocolMeta) => {
          history.push(`/edit/${encodeURIComponent(protocolMeta.workingPath)}`);
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

