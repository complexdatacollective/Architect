const SET_GUIDANCE = Symbol('PROTOCOL/SET_GUIDANCE');
const RESET_GUIDANCE = Symbol('PROTOCOL/RESET_GUIDANCE');

const initialState = {
  id: null,
};

const setGuidance = id =>
  ({
    type: SET_GUIDANCE,
    id,
  });

const resetGuidance = () =>
  ({
    type: RESET_GUIDANCE,
  });


function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_GUIDANCE:
      return {
        ...state,
        id: action.id,
      };
    case RESET_GUIDANCE:
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
