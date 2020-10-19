import path from 'path';
import { uniqBy, get } from 'lodash';
import { actionTypes as loadActionTypes } from './protocols/load';
import { actionTypes as saveActionTypes } from './protocols/save';
import { actionTypes as bundleActionTypes } from './protocols/bundle';
import { actionTypes as unbundleActionTypes } from './protocols/unbundle';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case unbundleActionTypes.UNBUNDLE_PROTOCOL_ERROR:
      return state.filter(protocol =>
        protocol.filePath !== action.filePath,
      );
    // 1. we unbundled it from disk so we can be sure this
    // is an existing protocol. But we don't know the meta
    // so we just add the file entry for now.
    case unbundleActionTypes.UNBUNDLE_PROTOCOL_SUCCESS: {
      const filePath = action.filePath;
      return uniqBy([
        {
          filePath,
          lastModified: new Date().getTime(),
        },
        ...state,
      ])
        .sort((a, b) => a.lastModified < b.lastModified)
        .slice(0, 50);
    }
    // 2. we loaded protocol from a working copy,
    // it may be from a file entry, but it might not
    // be so only add meta if it exists in recentProtocols
    // already (e.g. added in UNBUNDLE_PROTOCOL_SUCCESS)
    case loadActionTypes.LOAD_PROTOCOL_SUCCESS:
      return state.map((protocol) => {
        const filePath = get(action, 'meta.filePath');
        if (protocol.filePath !== filePath) { return protocol; }

        return {
          ...protocol,
          lastModified: new Date().getTime(),
          name: path.basename(filePath, '.netcanvas'),
          description: action.protocol.description,
          schemaVersion: action.protocol.schemaVersion,
        };
      }).sort((a, b) => a.lastModified < b.lastModified);
    // We saved it, we know everything about the protocol
    case saveActionTypes.SAVE_PROTOCOL_SUCCESS: {
      const filePath = get(action, 'meta.filePath');
      return uniqBy([
        {
          filePath,
          lastModified: new Date().getTime(),
          name: path.basename(filePath, '.netcanvas'),
          description: action.protocol.description,
          schemaVersion: action.protocol.schemaVersion,
        },
        ...state,
      ])
        .sort((a, b) => a.lastModified < b.lastModified)
        .slice(0, 50);
    }
    default:
      return state;
  }
}

const actionCreators = {
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

