/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import undoable from 'redux-undo';
import protocol from './protocol';
import protocols from './protocols';
import recentProtocols from './recentProtocols';
import session from './session';
import guidance from './guidance';

const combineFilters = (...filters) =>
  (...args) =>
    filters.reduce(
      (memo, filter) => memo && filter(...args),
      true,
    );

/*
 * state: {
 *   protocol: {} // current loaded protocol
 *   protocols: {} // list of imported protocols (not persistent)
 *   recentProtocols: {} // list of known protocols (persistent)
 * }
 */
export const rootReducer = combineReducers({
  form: formReducer,
  session,
  locale: () => 'en-US',
  guidance,
  protocol: undoable(
    protocol,
    {
      limit: 25,
      filter: combineFilters(
        ({ type }) => !/^@@redux-form\//.test(type.toString()),
        ({ type }) => !/^persist\//.test(type.toString()),
        ({ type }) => !/^PROTOCOLS\//.test(type.toString()),
      ),
    },
  ),
  protocols,
  recentProtocols,
});
