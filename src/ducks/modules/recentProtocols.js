import { uniqBy } from 'lodash';
import {
  actionTypes as importActionTypes,
} from './protocols/load';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case importActionTypes.LOAD_PROTOCOL_SUCCESS:
      return uniqBy([
        { filePath: action.meta.filePath, lastOpened: new Date().getTime() },
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

