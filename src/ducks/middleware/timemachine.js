import uuid from 'uuid';
import { get } from 'lodash';

const defaultOptions = {
  limit: -1000,
};

const JUMP = 'TIMEMACHINE/JUMP';
const RESET = 'TIMEMACHINE/RESET';

const jump = locus => ({
  type: JUMP,
  payload: { locus },
});

const reset = () => ({
  type: RESET,
});

const createTimemachine = (reducer, customOptions) => {
  const options = {
    ...defaultOptions,
    ...customOptions,
  };

  const initialState = {
    past: [],
    present: undefined,
    timeline: [],
  };

  const timemachine = (state = initialState, action) => {
    const { past, present, timeline } = state;

    if (get(action, 'type') === RESET) {
      return {
        past: [],
        present: reducer(undefined, {}),
        timeline: [uuid()],
      };
    }

    if (get(action, 'type') === JUMP) {
      if (!action.payload.locus) { return state; }
      const locusIndex = timeline.indexOf(action.payload.locus);

      // no events in timeline yet
      if (timeline.length === 1) {
        return state;
      }

      // the last point in the timeline is the present
      if (locusIndex === timeline.length - 1) {
        return state;
      }

      const newPresent = past[locusIndex];

      return {
        past: past.slice(0, locusIndex),
        present: newPresent,
        timeline: timeline.slice(0, locusIndex + 1),
      };
    }

    const newPresent = reducer(present, action);

    // This is the first run
    if (timeline.length === 0) {
      const locus = uuid();

      return {
        past: [],
        present: newPresent,
        timeline: [locus],
      };
    }

    // If newPresent matches the old one, ignore
    if (present === newPresent) {
      return state;
    }

    // If filtered, we don't treat this as a new
    // point in the timeline.
    if (
      options.filter &&
      !options.filter(action)
    ) {
      return {
        past,
        present: newPresent,
        timeline,
      };
    }

    const locus = uuid();

    return {
      past: [...past, present].slice(options.limit),
      present: newPresent,
      timeline: [...timeline, locus].slice(options.limit - 1),
    };
  };

  return timemachine;
};

export const actionTypes = {
  RESET,
};

export const actionCreators = {
  jump,
  reset,
};

export default createTimemachine;
