import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import stages from './stages';

const appReducer = combineReducers({
  form: formReducer,
  stages,
});

export default appReducer;
