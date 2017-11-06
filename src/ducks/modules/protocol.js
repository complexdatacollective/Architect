import { combineReducers } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import stages from './stages';
import variableRegistry from './variableRegistry';
import protocolOptions from './protocolOptions';

export default undoable(
  combineReducers({
    options: protocolOptions,
    stages,
    variableRegistry,
  }),
  {
    limit: 25,
    filter: excludeAction(['persist/REHYDRATE']),
  },
);
