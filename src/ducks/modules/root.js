/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import undoable, { excludeAction } from 'redux-undo';
import protocol from './protocol';
import session from './session';
import protocols from './protocols';
import { actionTypes as protocolFileActionTypes } from './protocol/file';

/*
 * state: {
 *   protocol: {} // current loaded protocol
 *   protocols: {} // list of knowe protocols (persistent)
 * }
 */
export const rootReducer = combineReducers({
  form: formReducer,
  session,
  protocol: undoable(
    protocol,
    {
      limit: 25,
      filter: excludeAction([
        'persist/REHYDRATE',
        protocolFileActionTypes.SAVE_COMPLETE,
      ]),
    },
  ),
  protocols,
});
