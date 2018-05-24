import stages from './stages';
import forms from './forms';
import variableRegistry from './variableRegistry';
import externalData from './externalData';
import { actionTypes as fileActionTypes } from './file';

const initialState = {};

const SET_PROTOCOL = Symbol('PROTOCOL/SET_PROTOCOL');

const resetProtocol = () => ({
  type: SET_PROTOCOL,
  protocol: {},
  meta: {},
});

function protocolReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROTOCOL:
    case fileActionTypes.OPEN_PROTOCOL:
      return { ...action.protocol };
    default:
      return state;
  }
}

const actionCreators = {
  resetProtocol,
};

const actionTypes = {
  SET_PROTOCOL,
};

export {
  actionCreators,
  actionTypes,
};

const reduceReducers = (...reducers) =>
  (previousState, action) =>
    reducers.reduce((state, reducer) => reducer(state, action), previousState);

export default reduceReducers(
  protocolReducer,
  (state, action) => ({
    ...state,
    stages: stages(state.stages, action),
    forms: forms(state.forms, action),
    variableRegistry: variableRegistry(state.variableRegistry, action),
    externalData: externalData(state.externalData, action),
  }),
);
