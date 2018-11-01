import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import { rootReducer, rootEpic as architectRootEpic } from './modules/root';
import { rootEpic as previewEpic } from './preview/root';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['recentProtocols', 'protocols'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rootEpic = combineEpics(
  architectRootEpic,
  previewEpic,
);

const epics = createEpicMiddleware(rootEpic);

const store = createStore(
  persistedReducer,
  undefined,
  compose(
    applyMiddleware(thunk, logger, epics),
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
