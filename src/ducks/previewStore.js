import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from '../network-canvas/src/ducks/middleware/logger';
import epics from '../network-canvas/src/ducks/middleware/epics';
import rootReducer from './modules/preview';

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(thunk, logger, epics),
);

export default store;
