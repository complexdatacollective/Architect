import { combineReducers } from 'redux';
import guidance, { actionCreators as guidanceActionCreators } from './guidance';
import screens, { actionCreators as screenActionCreators } from './screens';

const ui = combineReducers({
  guidance,
  screens,
});

export const actionCreators = {
  ...guidanceActionCreators,
  ...screenActionCreators,
};

export default ui;
