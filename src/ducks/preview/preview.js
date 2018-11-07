import { combineEpics } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { omit } from 'lodash';
import history from '../../history';
import previewStoreData from './previewStore.json';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';

const initialState = {
  ...previewStoreData,
};

const OPEN_PREVIEW = 'PREVIEW/OPEN_PREVIEW';
const SET_PROTOCOL = 'PREVIEW/SET_PROTOCOL';

const openPreview = (protocol, path = '', stageIndex = 0) => ({
  type: OPEN_PREVIEW,
  protocol,
  path,
  stageIndex,
});

const setProtocol = (protocol, path = '') => ({
  type: SET_PROTOCOL,
  protocol,
  path,
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

const openPreviewEpic = action$ =>
  action$.pipe(
    filter(({ type }) => type === OPEN_PREVIEW),
    map((action) => {
      const { protocol, path, stageIndex } = action;

      history.push(`/preview/${stageIndex}`);

      return setProtocol(protocol, path);
    }),
  );

const actionTypes = {
  SET_PROTOCOL,
  OPEN_PREVIEW,
};

const actionCreators = {
  setProtocol,
  openPreview,
};

const epics = combineEpics(
  openPreviewEpic,
);

export {
  actionTypes,
  actionCreators,
  epics,
};

export default previewReducer;
