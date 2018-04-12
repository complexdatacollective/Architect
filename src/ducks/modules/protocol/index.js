import { combineReducers } from 'redux';
import stages from './stages';
import protocolOptions from './protocolOptions';
import forms from './forms';
import variableRegistry from './variableRegistry';
import externalData from './externalData';

const initialState = {};

const SET_PROTOCOL = Symbol('PROTOCOL/SET_PROTOCOL');

const setProtocol = (protocol, path = '') => ({
  type: SET_PROTOCOL,
  path,
  protocol,
});

function protocolReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROTOCOL:
      return { ...action.protocol };
    default:
      return state;
  }
}

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

const flatCombineReducers = (...reducers) =>
  (previousState, action) =>
    reducers.reduce((state, reducer) => reducer(state, action), previousState);

export default flatCombineReducers(
  protocolReducer,
  combineReducers({
    options: protocolOptions,
    stages,
    forms,
    variableRegistry,
    externalData,
  }),
);
