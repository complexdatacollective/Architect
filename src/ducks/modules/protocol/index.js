import { pick } from 'lodash';
import stages from './stages';
import codebook from './codebook';
import assetManifest from './assetManifest';
import { saveableChange } from '../session';

const initialState = {};

const UPDATE_OPTIONS = 'PROTOCOL/UPDATE_OPTIONS';
const SET_PROTOCOL = 'PROTOCOL/SET';

const updateOptions = (options) => ({
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
    case 'SESSION/RESET_SESSION':
      return initialState;
    case SET_PROTOCOL:
      return { ...action.protocol };
    case 'SESSION/OPEN_NETCANVAS_SUCCESS':
      return {
        ...action.payload.protocol,
      };
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
  updateOptions: saveableChange(updateOptions),
  setProtocol,
};

const actionTypes = {
  UPDATE_OPTIONS,
  SET_PROTOCOL,
};

const test = {
  updateOptions,
};

const reduceReducers = (...reducers) => (
  previousState, action,
) => reducers.reduce((state, reducer) => reducer(state, action), previousState);

export default reduceReducers(
  protocolReducer,
  (state, action) => ({
    ...state,
    stages: stages(state.stages, action),
    codebook: codebook(state.codebook, action),
    assetManifest: assetManifest(state.assetManifest, action),
  }),
);

export {
  actionCreators,
  actionTypes,
  test,
};
