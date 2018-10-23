import { omit } from 'lodash';
import previewStoreData from '../../components/Preview/previewStore.json';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';

const initialState = {
  ...previewStoreData,
};

const LOAD_PREVIEW = 'ARCHITECT/LOAD_PREVIEW';

const loadPreview = protocol => ({
  type: LOAD_PREVIEW,
  protocol,
});

const previewReducer = (state = initialState, action) => {
  console.log('PREVIEW REDUCER', action.type);
  if (action.type === LOAD_PREVIEW) {
    console.log('PREVIEW REDUCER');
    return {
      ...state,
      protocol: {
        ...state.protocol,
        ...omit(action.protocol, 'externalData'),
        protocolPath: null, // TODO: Do we need this for assets?
      },
    };
  }
  return rootReducer(state, action);
};

const actionTypes = {
  LOAD_PREVIEW,
};

const actionCreators = {
  loadPreview,
};

export {
  actionTypes,
  actionCreators,
};

export default previewReducer;
