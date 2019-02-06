import { actionTypes as assetActionTypes } from './assets';

const initialState = {};

// TODO: merge this and ./assets
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case assetActionTypes.IMPORT_ASSET_COMPLETE:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          type: action.assetType,
          name: action.name,
          source: action.filename,
        },
      };
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
