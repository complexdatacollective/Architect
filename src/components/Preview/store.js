import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import previewStoreData from './previewStore.json';
import logger from '../../ducks/middleware/logger';
import epics from '../../network-canvas/src/ducks/middleware/epics';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';
import '../../network-canvas/src/styles/main.scss';

const store = createStore(
  rootReducer,
  {
    ...previewStoreData,
  },
  applyMiddleware(thunk, logger, epics),
);

export default store;
