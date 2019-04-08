import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import ipc from './ipc';
import { rootReducer, rootEpic as architectRootEpic } from './modules/root';
import linkStore from './preview/linkStore';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['recentProtocols', 'protocols'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rootEpic = combineEpics(
  architectRootEpic,
  linkStore,
);

const epics = createEpicMiddleware(rootEpic);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const enhancers = composeEnhancers(
  applyMiddleware(thunk, logger, ipc, epics),
);

const store = createStore(
  persistedReducer,
  undefined,
  enhancers,
);

const persistor = persistStore(store);

export {
  store,
  persistor,
};
