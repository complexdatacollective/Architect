import { pick } from 'lodash';
import stages from './stages';
import forms from './forms';
import variableRegistry from './variableRegistry';
import externalData from './externalData';
import { actionTypes as loadProtocolActionTypes } from '../protocols/load';

const initialState = {};

const SET_PROTOCOL = Symbol('PROTOCOL/SET_PROTOCOL');
const UPDATE_OPTIONS = Symbol('PROTOCOL/UPDATE_OPTIONS');

const resetProtocol = () => ({
  type: SET_PROTOCOL,
  protocol: {},
  meta: {},
});

const updateOptions = options => ({
  type: UPDATE_OPTIONS,
  options,
});

function protocolReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROTOCOL:
    case loadProtocolActionTypes.LOAD_PROTOCOL_SUCCESS:
      return { ...action.protocol };
    case UPDATE_OPTIONS:
      return {
        ...state,
        ...pick(action.options, ['name', 'version']),
      };
    default:
      return state;
  }
}

const actionCreators = {
  resetProtocol,
  updateOptions,
};

const actionTypes = {
  SET_PROTOCOL,
  UPDATE_OPTIONS,
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
