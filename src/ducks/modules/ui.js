const OPEN_SCREEN = 'UI/OPEN_SCREEN';
const UPDATE_SCREEN = 'UI/UPDATE_SCREEN';
const CLOSE_SCREEN = 'UI/CLOSE_SCREEN';

const initialState = {
  root: {
    screen: 'start', // start or protocol,
    params: {},
  },
  screens: [],
  params: {},
};

const openScreen = (screen, params = {}, root = false) => ({
  type: OPEN_SCREEN,
  payload: {
    screen,
    params,
    root,
  },
});

const closeScreen = (screen, params = {}) => ({
  type: CLOSE_SCREEN,
  payload: {
    screen,
    params,
  },
});

const updateScreen = (screen, params = {}) => ({
  type: UPDATE_SCREEN,
  payload: {
    screen,
    params,
  },
});

const getUpdatedScreen = (screen, params) => ({
  ...screen,
  params: {
    ...screen.params,
    ...params,
  },
});

export default (state = initialState, { type, payload } = { type: null, payload: null }) => {
  switch (type) {
    case OPEN_SCREEN:
      // TODO: root
      return {
        ...state,
        screens: [
          ...state.screens,
          {
            screen: payload.screen,
            params: { ...payload.params, },
          },
        ],
      };
    case CLOSE_SCREEN:
      return {
        ...state,
        screens: state.screens
          .filter(({ screen }) => screen !== payload.screen),
        params: {
          ...payload.params,
        },
      };
    case UPDATE_SCREEN:
      return {
        ...state,
        root: state.root.screen === payload.screen ?
          getUpdatedScreen(state.root, payload.params) :
          state.root,
        screens: state.screens
          .map((screen) => {
            if (screen.screen !== payload.screen) { return screen; }
            return getUpdatedScreen(screen, payload.params);
          }),
      };
    default:
      return state;
  }
};

export const actionTypes = {
  OPEN_SCREEN,
  CLOSE_SCREEN,
  UPDATE_SCREEN,
};

export const actionCreators = {
  openScreen,
  closeScreen,
  updateScreen,
};
