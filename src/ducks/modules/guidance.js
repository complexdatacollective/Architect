const SET_GUIDANCE = Symbol('PROTOCOL/SET_GUIDANCE');
const RESET_GUIDANCE = Symbol('PROTOCOL/RESET_GUIDANCE');

const initialState = {
  id: null,
  locked: false,
};

const setGuidance = (id, lock = false) =>
  ({
    type: SET_GUIDANCE,
    id,
    lock,
  });

const resetGuidance = (unlock = false) =>
  ({
    type: RESET_GUIDANCE,
    unlock,
  });


function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_GUIDANCE:
      if (state.locked && !action.lock) { return state; }
      return {
        ...state,
        id: action.id,
        locked: action.lock,
      };
    case RESET_GUIDANCE:
      if (state.locked && !action.unlock) { return state; }
      return { ...initialState };
    default:
      return state;
  }
}

const actionCreators = {
  setGuidance,
  resetGuidance,
};

const actionTypes = {
  SET_GUIDANCE,
  RESET_GUIDANCE,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
