import { importProtocol } from './import';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

const actionCreators = {
  importProtocol,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

