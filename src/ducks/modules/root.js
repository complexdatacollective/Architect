/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { reducer as formReducer } from 'redux-form';
import createTimeline from '../middleware/timeline';
// import undoable from 'redux-undo';
import dialogs from './dialogs';
import ui from './ui';
import stacks from './stacks';
import protocol from './protocol';
import protocols from './protocols';
import recentProtocols from './recentProtocols';
import session, { epics as sessionEpics } from './session';
import guidance from './guidance';
import settings from './settings';

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
  ui,
  settings,
  stacks,
  protocol: createTimeline(
    protocol,
    {
      filter: ({ type }) => /^PROTOCOL\//.test(type.toString()),
    },
  ),
  protocols,
  recentProtocols,
});
