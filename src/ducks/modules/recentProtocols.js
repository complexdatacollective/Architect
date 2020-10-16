import path from 'path';
import { uniqBy } from 'lodash';
import { actionTypes as loadActionTypes } from './protocols/load';
import { actionTypes as bundleActionTypes } from './protocols/bundle';
import { actionTypes as unbundleActionTypes } from './protocols/unbundle';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case unbundleActionTypes.UNBUNDLE_PROTOCOL_ERROR:
      return state.filter(protocol =>
        protocol.filePath !== action.filePath,
      );
    case loadActionTypes.LOAD_PROTOCOL_SUCCESS:
      return uniqBy(
        [
          {
            filePath: action.meta.filePath,
            lastModified: new Date().getTime(),
            name: path.basename(action.meta.filePath, '.netcanvas'),
            description: action.protocol.description,
            schemaVersion: action.protocol.schemaVersion,
          },
          ...state,
        ].sort((a, b) => a.lastOpened < b.lastOpened),
        'filePath',
      )
        .slice(0, 50);
    // case unbundleActionTypes.UNBUNDLE_PROTOCOL_SUCCESS:
    // -- Why would we update lastOpened on unbundle, not load succcess (above)?
    case bundleActionTypes.BUNDLE_PROTOCOL_SUCCESS:
      return state.map((recent) => {
        if (recent.filePath === action.filePath) {
          return {
            ...recent,
            lastOpened: new Date().getTime(),
          };
        }

        return recent;
      });
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

