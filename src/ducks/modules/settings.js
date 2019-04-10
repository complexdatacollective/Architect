const UPDATE_GUIDANCE = 'UI/UPDATE_GUIDANCE';

const initialState = {
  showGuidance: true,
};

const updateGuidance = open => ({
  type: UPDATE_GUIDANCE,
  payload: {
    open,
  },
});

export default (state = initialState, { type, payload } = { type: null, payload: null }) => {
  switch (type) {
    case UPDATE_GUIDANCE:
      return {
        ...state,
        showGuidance: payload.open,
      };
    default:
      return state;
  }
};

export const actionTypes = {
  UPDATE_GUIDANCE,
};

export const actionCreators = {
  updateGuidance,
};
