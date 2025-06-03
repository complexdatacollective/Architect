import { actionTypes as sessionActionTypes } from '@modules/session';

const OPEN_SCREEN = 'UI/OPEN_SCREEN';
const UPDATE_SCREEN = 'UI/UPDATE_SCREEN';
const CLOSE_SCREEN = 'UI/CLOSE_SCREEN';

const initialState = {
  root: {
    screen: 'start', // start or protocol,
    params: {},
  },
  screens: [
    // {
    //   screen: 'variable',
    //   params: {
    //     entity: 'node',
    //     type: 'd39a47507bbe27c2a7948861847f3607eda8s8j',
    //   },
    // },
  ],
  message: {},
};

const openScreen = (screen, params = {}, root = false) => (dispatch, getState) => {
  const state = getState();
  const latestLocus = state.protocol.timeline[state.protocol.timeline.length - 1];
  const locus = params.locus || latestLocus;

  dispatch({
    type: OPEN_SCREEN,
    payload: {
      screen,
      params: {
        ...params,
        locus,
      },
      root,
    },
  });
};

const closeScreen = (screen, params = null) => ({
  type: CLOSE_SCREEN,
  payload: {
    screen,
    ...(params ? { params } : {}),
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
    case sessionActionTypes.OPEN_PROTOCOL_SUCCESS:
    case sessionActionTypes.RESET_SESSION:
      return {
        ...initialState,
      };
    case OPEN_SCREEN:
      // TODO: root
      return {
        ...state,
        screens: [
          ...state.screens,
          {
            screen: payload.screen,
            params: { ...payload.params },
          },
        ],
        message: {},
      };
    case CLOSE_SCREEN: {
      const message = payload.params
        ? {
          ...state.message,
          screen: payload.screen,
          params: payload.params,
        }
        : state.message;

      return {
        ...state,
        screens: state.screens
          .filter(({ screen }) => screen !== payload.screen),
        message,
      };
    }
    case UPDATE_SCREEN:
      return {
        ...state,
        root: state.root.screen === payload.screen
          ? getUpdatedScreen(state.root, payload.params)
          : state.root,
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
