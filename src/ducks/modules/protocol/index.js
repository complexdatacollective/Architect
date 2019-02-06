import { pick } from 'lodash';
import stages from './stages';
import forms from './forms';
import variableRegistry from './variableRegistry';
import assetManifest from './assetManifest';
import { actionTypes as loadProtocolActionTypes } from '../protocols/load';

const initialState = {};

const UPDATE_OPTIONS = 'PROTOCOL/UPDATE_OPTIONS';

const updateOptions = options => ({
  type: UPDATE_OPTIONS,
  options,
});

function protocolReducer(state = initialState, action = {}) {
  switch (action.type) {
    case loadProtocolActionTypes.LOAD_PROTOCOL_SUCCESS:
      return { ...action.protocol };
    case UPDATE_OPTIONS:
      return {
        ...state,
        ...pick(action.options, ['name', 'version', 'description']),
      };
    default:
      return state;
  }
}

const actionCreators = {
  updateOptions,
};

const actionTypes = {
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
    assetManifest: assetManifest(state.assetManifest, action),
  }),
);
