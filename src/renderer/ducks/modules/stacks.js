import {
  reduce,
  omit,
} from 'lodash';

const getNextIndexForGroup = (indexes, group) => reduce(
  indexes,
  (memo, stackable) => {
    if (group === stackable.group && stackable.index >= memo) {
      return stackable.index + 1;
    }
    return memo;
  },
  0,
);

const defaultGroup = 'GLOBAL';

const REGISTER_STACKABLE = 'stacks/registerStackable';
const UNREGISTER_STACKABLE = 'stacks/unregisterStackable';
const MOVE_TO_TOP = 'stacks/moveToTop';

const registerStackable = (id, group = defaultGroup) => ({
  type: REGISTER_STACKABLE,
  id,
  group,
});

const unregisterStackable = (id) => ({
  type: UNREGISTER_STACKABLE,
  id,
});

const moveToTop = (id) => ({
  type: MOVE_TO_TOP,
  id,
});

const initialState = {
  // id: { index, group }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_STACKABLE: {
      const nextIndex = getNextIndexForGroup(state, action.group);
      return {
        ...state,
        [action.id]: {
          ...action,
          index: nextIndex,
        },
      };
    }
    case MOVE_TO_TOP: {
      const item = state[action.id];
      if (!item) { return state; }
      const nextIndex = getNextIndexForGroup(state, item.group);
      return {
        ...state,
        [action.id]: {
          ...item,
          index: nextIndex,
        },
      };
    }
    case UNREGISTER_STACKABLE:
      return omit(state, action.id);
    default:
      return state;
  }
};

export const actionTypes = {
  REGISTER_STACKABLE,
  UNREGISTER_STACKABLE,
  MOVE_TO_TOP,
};

export const actionCreators = {
  registerStackable,
  unregisterStackable,
  moveToTop,
};
