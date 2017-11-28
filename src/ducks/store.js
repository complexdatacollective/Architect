import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import { rootEpic, rootReducer } from './modules/root';

const epics = createEpicMiddleware(rootEpic);

export const store = createStore(
  rootReducer,
  undefined,
  compose(
    autoRehydrate(),
    applyMiddleware(thunk, epics, logger),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f,
  ),
);

export const persistor = persistStore(store, { blacklist: ['form', 'stages'] });
