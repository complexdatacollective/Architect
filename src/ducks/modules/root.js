/* eslint-disable import/prefer-default-export */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import undoable, { excludeAction } from 'redux-undo';
import protocol from './protocol';
import meta from './meta';
import protocols from './protocols';

/*
 * state: {
 *   protocol: {} // current loaded protocol
 *   protocols: {} // list of knowe protocols (persistent)
 * }
 */
export const rootReducer = combineReducers({
  form: formReducer,
  meta,
  protocol: undoable(
    protocol,
    {
      limit: 25,
      filter: excludeAction(['persist/REHYDRATE']),
    },
  ),
  protocols,
});
