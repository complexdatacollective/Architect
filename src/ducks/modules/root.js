/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { reducer as formReducer } from 'redux-form';
import undoable from 'redux-undo';
import dialogs from './dialogs';
import protocol from './protocol';
import protocols from './protocols';
import recentProtocols from './recentProtocols';
import session, { epics as sessionEpics } from './session';
import guidance from './guidance';

const combineFilters = (...filters) =>
  (...args) =>
    filters.reduce(
      (memo, filter) => memo && filter(...args),
      true,
    );


export const rootEpic = combineEpics(
  sessionEpics,
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
  dialogs,
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
