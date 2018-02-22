import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { reducer as formReducer } from 'redux-form';
import undoable, { excludeAction } from 'redux-undo';
import protocol, { epics as protocolEpics } from './protocol';
import protocols, { epics as protocolsEpics } from './protocols';

export const rootEpic = combineEpics(
  protocolEpics,
  protocolsEpics,
);

/*
 * state: {
 *   protocol: {} // current loaded protocol
 *   protocols: {} // list of knowe protocols (persistent)
 * }
 */

export const rootReducer = combineReducers({
  form: formReducer,
  protocol: undoable(
    protocol,
    {
      limit: 25,
      filter: excludeAction(['persist/REHYDRATE']),
    },
  ),
  protocols,
});
