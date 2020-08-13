import { combineReducers } from 'redux';
import screens, { actionCreators as screenActionCreators } from './screens';

const UPDATE = 'UI/UPDATE';

const update = state => ({
  type: UPDATE,
  state,
});

const initialState = {};

const uiReducer = function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
};

const ui = combineReducers({
  screens,
  uiReducer,
});

export const actionCreators = {
  ...screenActionCreators,
  update,
};

export default ui;
