import { combineReducers, compose } from 'redux';
import { combineEpics } from 'redux-observable';
import stages from './stages';
import variableRegistry from './variableRegistry';
import protocolOptions from './protocolOptions';
import { epics as exportEpics } from './export';

const initialState = {};

const SET_PROTOCOL = Symbol('PROTOCOL/SET_PROTOCOL');

const setProtocol = protocol => ({ type: SET_PROTOCOL, protocol });

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_PROTOCOL:
      return { ...action.protocol };
    default:
      return state;
  }
};

const actionCreators = {
  setProtocol,
};

const actionTypes = {
  SET_PROTOCOL,
};

export const epics = combineEpics(
  exportEpics,
);

export {
  actionCreators,
  actionTypes,
};

export default compose(
  combineReducers({
    options: protocolOptions,
    stages,
    variableRegistry,
  }),
  reducer,
);
