import { combineReducers, compose } from 'redux';
import stages from './stages';
import variableRegistry from './variableRegistry';
import protocolOptions from './protocolOptions';

const initialState = {};

const SET_PROTOCOL = Symbol('PROTOCOL/SET_PROTOCOL');

const setProtocol = (protocol, path = '') => ({
  type: SET_PROTOCOL,
  path,
  protocol,
});

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
