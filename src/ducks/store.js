import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import { rootReducer } from './modules/root';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['form', 'protocol', 'session', 'guidance'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  undefined,
  compose(
    applyMiddleware(thunk, logger),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f,
  ),
);

export const persistor = persistStore(store);
