import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import ipc from './ipc';
import logger from './middleware/logger';
import { rootEpic } from './preview/root';
import rootReducer from './preview/preview';

const epics = createEpicMiddleware(rootEpic);

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(thunk, logger, ipc, epics),
);

export default store;
