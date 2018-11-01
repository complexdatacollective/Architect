import { omit } from 'lodash';
import previewStoreData from './previewStore.json';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';

// TODO: This contains actionCreators that overlap stores, and probably ought to be separated

const initialState = {
  ...previewStoreData,
};

const SET_PROTOCOL = 'PREVIEW/SET_PROTOCOL';

const setProtocol = ({ protocol, path, stageIndex = 0 }) => ({
  type: SET_PROTOCOL,
  protocol,
  path,
  stageIndex,
});

const previewReducer = (state = initialState, action) => {
  if (action.type === SET_PROTOCOL) {
    return {
      ...state,
      protocol: {
        ...state.protocol,
        ...omit(action.protocol, 'externalData'),
        path: action.path.slice(1),
        protocolPath: null,
      },
    };
  }

  return rootReducer(state, action);
};

const actionTypes = {
  SET_PROTOCOL,
};

const actionCreators = {
  setProtocol,
};

export {
  actionTypes,
  actionCreators,
};

export default previewReducer;
