import { combineReducers } from 'redux';
import screens, { actionCreators as screenActionCreators } from './screens';
import busy from './busy';

const ui = combineReducers({
  screens,
  busy,
});

export const actionCreators = {
  ...screenActionCreators,
};

export default ui;
