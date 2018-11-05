import { combineEpics } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { omit } from 'lodash';
import history from '../../history';
import previewStoreData from './previewStore.json';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';

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

const openPreviewEpic = action$ =>
  action$.pipe(
    filter(({ type }) => type === 'OPEN_PREVIEW'),
    map((action) => {
      const { protocol, path, stageIndex } = action.payload;

      history.push(`/preview/${stageIndex}`);

      return setProtocol({ protocol, path, stageIndex });
    }),
  );

const actionTypes = {
  SET_PROTOCOL,
};

const actionCreators = {
  setProtocol,
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
