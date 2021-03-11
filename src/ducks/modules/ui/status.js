const getStatus = (state) => state.ui.status;

const getIsBusy = (state, type) => {
  const status = getStatus(state);
  const isBusy = status.busy.some((busy) => busy.type === type.toString());
  return isBusy;
};

const BUSY = 'STATUS/BUSY';
const READY = 'STATUS/READY';
const NOOP = 'STATUS/NOOP';

const busy = (type = '', meta) => ({
  type: BUSY,
  payload: type,
  ...(meta || {}),
});

const ready = (type = '') => ({
  type: READY,
  payload: type,
});

const noop = (type = '') => ({
  type: NOOP,
  payload: type,
});

/**
 * Convert an action (thunk) into a 'throttled' action, that can only be run one at a time.
 * `nextAction` must be a promise.
 *
 * Usage:
<pre><code>
const myLock = createLock('NAME FOR LOCK');
const myThunk = () => (dispatch) => { ...dispatch actions here };
const myThrottledThunk = myLock(myThunk);
// Can wrap multiple thunks in the same lock, so that
// they cannot be run simultaneously
const anotherThrottledThunk = myLock(anotherThunk);
</code></pre>
 */
export const createLock = (type) => {
  const fn = (nextAction) => (...args) => (dispatch, getState) => {
    // If this type is already running, dispatch a noop and don't run action.
    const isBusy = getIsBusy(getState(), type);
    if (isBusy) { dispatch(noop(type)); return Promise.resolve(); }

    // Mark this type as busy
    dispatch(busy(type));

    // Run the action as normal
    return dispatch(nextAction(...args))
      .finally(() => {
        // Once it's complete, mark this type as ready
        dispatch(ready(type));
      });
  };

  fn.toString = function toString() {
    return type;
  };

  return fn;
};

const initialState = {
  busy: [],
};

const filterType = (state, type) => state.filter((item) => item.type !== type);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case BUSY:
      return {
        ...state,
        busy: [...filterType(state.busy, action.payload), { type: action.payload }],
      };
    case READY:
      return {
        ...state,
        busy: filterType(state.busy, action.payload),
      };
    default:
      return state;
  }
}

const actionCreators = {
  busy,
  ready,
};

const actionTypes = {
  BUSY,
  READY,
  NOOP,
};

const selectors = {
  getStatus,
  getIsBusy,
};

export {
  actionCreators,
  actionTypes,
  selectors,
};
