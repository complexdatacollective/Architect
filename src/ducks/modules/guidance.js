import { last } from 'lodash';

const SET_GUIDANCE = 'GUIDANCE/SET';
const UNSET_GUIDANCE = 'GUIDANCE/UNSET';

const initialState = {
  id: null,
  history: [],
};

const setGuidance = (id, name = 'default') =>
  ({
    type: SET_GUIDANCE,
    id,
    name,
  });

const unsetGuidance = (name = 'default') =>
  ({
    type: UNSET_GUIDANCE,
    name,
  });

function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_GUIDANCE: {
      const history = state.history.filter(({ name }) => name !== action.name);
      return {
        ...state,
        history: [
          ...history,
          { name: action.name, id: action.id },
        ],
        id: action.id,
      };
    }
    case UNSET_GUIDANCE: {
      const history = state.history.filter(({ name }) => name !== action.name);

      return {
        ...state,
        history,
        id: history.length > 0 ? last(history).id : null,
      };
    }
    default:
      return state;
  }
}

const actionCreators = {
  setGuidance,
  unsetGuidance,
};

const actionTypes = {
  SET_GUIDANCE,
  UNSET_GUIDANCE,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
