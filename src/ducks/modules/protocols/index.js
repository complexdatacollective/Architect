import { combineEpics } from 'redux-observable';
import { epics as fileEpics } from './files';

const ADD_PROTOCOL = Symbol('PROTOCOLS/ADD');

const initialState = [{ path: '/foo/bar' }];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PROTOCOL:
      return [
        ...state,
        action.protocol,
      ];
    default:
      return state;
  }
}

function addProtocol(path) {
  return {
    type: ADD_PROTOCOL,
    protocol: { path },
  };
}

const actionCreators = {
  addProtocol,
};

const actionTypes = {
  ADD_PROTOCOL,
};

export const epics = combineEpics(
  fileEpics,
);

export {
  actionCreators,
  actionTypes,
};
