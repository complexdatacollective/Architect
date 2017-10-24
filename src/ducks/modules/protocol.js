import { combineReducers } from 'redux';

import stages from './stages';
import protocolOptions from './protocolOptions';

export default combineReducers({
  options: protocolOptions,
  stages,
});
