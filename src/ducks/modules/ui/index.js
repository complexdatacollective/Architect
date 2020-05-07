import { combineReducers } from 'redux';
import screens, { actionCreators as screenActionCreators } from './screens';
import status from './status';

const ui = combineReducers({
  screens,
  status,
});

export const actionCreators = {
  ...screenActionCreators,
};

export default ui;
