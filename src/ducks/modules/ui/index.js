import { combineReducers } from 'redux';
import screens, { actionCreators as screenActionCreators } from './screens';
import status from './status';
import simpleState, { actionCreators as simpleStateActionCreators } from './simpleState';

const ui = combineReducers({
  screens,
  status,
  simple: simpleState,
});

export const actionCreators = {
  ...screenActionCreators,
  ...simpleStateActionCreators,
};

export default ui;
