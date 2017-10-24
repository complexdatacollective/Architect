import { combineReducers } from 'redux';
import undoable from 'redux-undo';

import stages from './stages';
import protocolOptions from './protocolOptions';

export default undoable(combineReducers({
  options: protocolOptions,
  stages,
}));
