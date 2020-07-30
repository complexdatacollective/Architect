/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { reducer as formReducer } from 'redux-form';
import createTimeline from '../middleware/timeline';
// import undoable from 'redux-undo';
import app from './app';
import dialogs from './dialogs';
import guidance from './guidance';
import protocol from './protocol';
import protocols from './protocols';
import recentProtocols from './recentProtocols';
import session, { epics as sessionEpics } from './session';
import settings from './settings';
import stacks from './stacks';
import ui from './ui';

export const rootEpic = combineEpics(
  sessionEpics,
);

const timelineOptions = {
  filter: ({ type }) => /^PROTOCOL\//.test(type.toString()),
};

/*
 * state: {
 *   protocol: {} // current loaded protocol
 *   protocols: {} // list of imported protocols (not persistent)
 *   recentProtocols: {} // list of known protocols (persistent)
 * }
 */
export const rootReducer = combineReducers({
  app,
  dialogs,
  form: formReducer,
  guidance,
  locale: () => 'en-US',
  protocol: createTimeline(protocol, timelineOptions),
  protocols,
  recentProtocols,
  session,
  settings,
  stacks,
  ui,
});
