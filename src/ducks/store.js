import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import { rootReducer, rootEpic } from './modules/root';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['form', 'protocol', 'session', 'guidance'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
