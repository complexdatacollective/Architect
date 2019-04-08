import { isEqual } from 'lodash';

export const onUIMessage = (ui, prevUI, screen, handler) => {
  if (typeof handler !== 'function') {
    throw Error('onUIMessage: no handler provided');
  }
  if (isEqual(ui, prevUI)) { return false; }
  if (ui.screen !== screen) { return false; }
  return handler(ui.params);
};

const OPEN_SCREEN = 'UI/OPEN_SCREEN';
const UPDATE_SCREEN = 'UI/UPDATE_SCREEN';
const CLOSE_SCREEN = 'UI/CLOSE_SCREEN';
const UPDATE_GUIDANCE = 'UI/UPDATE_GUIDANCE';

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
  guidance: true,
};

const openScreen = (screen, params = {}, root = false) => ({
  type: OPEN_SCREEN,
  payload: {
    screen,
    params,
    root,
  },
});

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
        guidance: payload.open,
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
      const message = payload.params ?
        {
          ...state.message,
          screen: payload.screen,
          params: payload.params,
        } :
        state.message;

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
  UPDATE_GUIDANCE,
};

export const actionCreators = {
  openScreen,
  closeScreen,
  updateScreen,
  updateGuidance,
};
