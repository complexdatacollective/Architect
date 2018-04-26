import { createStore } from 'redux';
import { omit } from 'lodash';
import getAbsoluteBoundingRect from '../../utils/getAbsoluteBoundingRect';

const intitalState = [];

const UPDATE = Symbol('TWEEN/UPDATE');
const REMOVE = Symbol('TWEEN/REMOVE');

const updateAction = (name, uuid, properties) => ({
  ...properties,
  type: UPDATE,
  name,
  uuid,
});

const removeAction = (name, uuid) => ({
  type: REMOVE,
  name,
  uuid,
});

const reducer = (state = intitalState, action) => {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          [action.uuid]: {
            node: action.node,
            ...getAbsoluteBoundingRect(action.node),
          },
        },
      };
    case REMOVE:
      return {
        ...state,
        [action.name]: omit(state[action.name], action.uuid),
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
