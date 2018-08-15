import { importProtocol } from './import';
import { createProtocol } from './create';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

const actionCreators = {
  importProtocol,
  createProtocol,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

