import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import ipc from './ipc';
import logger from './middleware/logger';
import { rootReducer } from './modules/root';

const persistConfig = {
  key: 'architect',
  storage,
  whitelist: [
    'recentProtocols',
    // 'protocols',
    'settings',
    'app',
    // 'ui',
  ],
};

const getReducer = () => persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const getMiddleware = () => {
  // In test environment (set by Vitest), skip IPC middleware
  if (
    import.meta.env?.MODE === 'test' ||
    typeof window.electronAPI === 'undefined'
  ) {
    return [thunk];
  }

  return [thunk, logger, ipc];
};

const getEnhancers = () =>
  composeEnhancers(applyMiddleware(...getMiddleware()));

const getStore = (initialState) =>
  createStore(getReducer(), initialState, getEnhancers());

const store = getStore(undefined);

const persistor = persistStore(store);

export { getStore, store, persistor };
