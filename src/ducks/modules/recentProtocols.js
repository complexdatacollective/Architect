import { actionTypes as sessionActionTypes } from '@modules/session';
import { pathSync } from '@utils/electronBridge';
import { uniqBy } from 'lodash';

const initialState = [];

const addProtocol = (state, protocol) =>
  uniqBy([protocol, ...state], 'filePath')
    .toSorted((a, b) => b.lastModified - a.lastModified)
    .slice(0, 50);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case sessionActionTypes.OPEN_NETCANVAS_ERROR:
      return state.filter(
        (protocol) => protocol.filePath !== action.payload.filePath,
      );
    case sessionActionTypes.OPEN_NETCANVAS_SUCCESS: {
      const { filePath, protocol } = action.payload;
      return addProtocol(state, {
        filePath,
        lastModified: protocol.lastModified,
        name: pathSync.basename(filePath, '.netcanvas'),
        description: protocol.description,
        schemaVersion: protocol.schemaVersion,
      });
    }
    // We saved it, we know everything about the protocol
    case sessionActionTypes.SAVE_NETCANVAS_SUCCESS: {
      const { savePath: filePath, protocol } = action.payload;

      return addProtocol(state, {
        filePath,
        lastModified: Date.now(),
        name: pathSync.basename(filePath, '.netcanvas'),
        description: protocol.description,
        schemaVersion: protocol.schemaVersion,
      });
    }
    default:
      return state;
  }
}
