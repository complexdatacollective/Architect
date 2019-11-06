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
      return state.map((protocol) => {
        if (protocol.filePath !== action.meta.filePath) { return protocol; }

        return {
          ...protocol,
          lastOpened: new Date().getTime(),
        };
      }).sort((a, b) => a.lastOpened < b.lastOpened);
    case unbundleActionTypes.UNBUNDLE_PROTOCOL_SUCCESS:
    case bundleActionTypes.BUNDLE_PROTOCOL_SUCCESS:
      return uniqBy([
        { filePath: action.filePath, lastOpened: new Date().getTime() },
        ...state,
      ], 'filePath')
        .slice(0, 50);
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

