import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import protocol from './protocol';

const appReducer = combineReducers({
  form: formReducer,
  protocol,
});

export default appReducer;
