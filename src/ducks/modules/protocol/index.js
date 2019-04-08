import { pick } from 'lodash';
import stages from './stages';
import forms from './forms';
import codebook from './codebook';
import assetManifest from './assetManifest';

const initialState = {};

const UPDATE_OPTIONS = 'PROTOCOL/UPDATE_OPTIONS';
const SET_PROTOCOL = 'PROTOCOL/SET';

const updateOptions = options => ({
  type: UPDATE_OPTIONS,
  options,
});

const setProtocol = (meta, protocol) => ({
  type: SET_PROTOCOL,
  meta,
  protocol,
});

function protocolReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROTOCOL:
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
  setProtocol,
};

const actionTypes = {
  UPDATE_OPTIONS,
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
    codebook: codebook(state.codebook, action),
    assetManifest: assetManifest(state.assetManifest, action),
  }),
);
