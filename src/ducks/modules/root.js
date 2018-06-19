/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import undoable, { excludeAction } from 'redux-undo';
import protocol, { actionTypes as protocolActions } from './protocol';
import session from './session';
import protocols from './protocols';
import guidance from './guidance';
import { actionTypes as protocolFileActionTypes } from './protocol/file';

const combineFilters = (...filters) =>
  (...args) =>
    filters.reduce(
      (memo, filter) => memo && filter(...args),
      true,
    );

/*
 * state: {
 *   protocol: {} // current loaded protocol
 *   protocols: {} // list of knowe protocols (persistent)
 * }
 */
export const rootReducer = combineReducers({
  form: formReducer,
  session,
  guidance,
  protocol: undoable(
    protocol,
    {
      limit: 25,
      filter: combineFilters(
        ({ type }) => !/^@@redux-form\//.test(type.toString()),
        excludeAction([
          'persist/REHYDRATE',
          protocolFileActionTypes.SAVE_COMPLETE,
          protocolActions.SET_PROTOCOL,
        ]),
      ),
    },
  ),
  protocols,
});
