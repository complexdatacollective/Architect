import { uniqBy } from 'lodash';
import { actionTypes as loadActionTypes } from './protocols/load';
import { actionTypes as exportActionTypes } from './protocols/export';
import { actionTypes as importActionTypes } from './protocols/import';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case importActionTypes.IMPORT_PROTOCOL_ERROR:
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
    case importActionTypes.IMPORT_PROTOCOL_SUCCESS:
    case exportActionTypes.EXPORT_PROTOCOL_SUCCESS:
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

