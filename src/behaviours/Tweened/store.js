import { createStore } from 'redux';
import { omit } from 'lodash';

const intitalState = [];

const UPDATE = Symbol('TWEEN/UPDATE');
const REMOVE = Symbol('TWEEN/REMOVE');

const updateAction = (name, element, properties) => ({
  ...properties,
  type: UPDATE,
  name,
  element,
});

const removeAction = (name, element) => ({
  type: REMOVE,
  name,
  element,
});

const reducer = (state = intitalState, action) => {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          [action.element]: {
            node: action.node,
            bounds: action.bounds,
          },
        },
      };
    case REMOVE:
      return {
        ...state,
        [action.name]: omit(state[action.name], action.element),
      };
    default:
      return state;
  }
};

export const actionCreators = {
  update: updateAction,
  remove: removeAction,
};

const store = createStore(reducer);

export default store;
