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
  whitelist: ['recentProtocols', 'protocols', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rootEpic = combineEpics(
  architectRootEpic,
  linkStore,
);

const epics = createEpicMiddleware(rootEpic);

const store = createStore(
  persistedReducer,
  undefined,
  compose(
    applyMiddleware(thunk, logger, ipc, epics),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f,
  ),
);

const persistor = persistStore(store);

export {
  store,
  persistor,
};
