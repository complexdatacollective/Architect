import { combineReducers } from 'redux';

import stages from './stages';

const appReducer = combineReducers({
  stages,
});

export default appReducer;
