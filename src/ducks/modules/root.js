/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createTimeline from '../middleware/timeline';
import app from './app';
import dialogs from './dialogs';
import protocol from './protocol';
import recentProtocols from './recentProtocols';
import session from './session';
import stacks from './stacks';
import ui from './ui';
import toasts from './toasts';

const protocolPattern = /^PROTOCOL\//;

const timelineOptions = {
  exclude: ({ type }) => !protocolPattern.test(type.toString()),
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
  locale: () => 'en-US',
  protocol: createTimeline(protocol, timelineOptions),
  recentProtocols,
  session,
  stacks,
  ui,
  toasts,
});
