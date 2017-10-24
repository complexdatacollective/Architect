import { combineReducers } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import stages from './stages';
import protocolOptions from './protocolOptions';

export default undoable(
  combineReducers({
    options: protocolOptions,
    stages,
  }),
  {
    limit: 25,
    filter: excludeAction(['persist/REHYDRATE']),
  },
);
