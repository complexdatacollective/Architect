import { combineReducers } from 'redux';
import screens, { actionCreators as screenActionCreators } from './screens';

const ui = combineReducers({
  screens,
});

export const actionCreators = {
  ...screenActionCreators,
};

export default ui;
