import uuid from 'uuid';
import { get } from 'lodash';

const defaultOptions = {
  limit: 1000,
  exclude: () => false,
};

const JUMP = 'TIMELINE/JUMP';
const RESET = 'TIMELINE/RESET';

const jump = (locus) => ({
  type: JUMP,
  payload: { locus },
});

const reset = () => ({
  type: RESET,
});

const createTimelineReducer = (reducer, customOptions) => {
  const options = {
    ...defaultOptions,
    ...customOptions,
  };

  const initialState = {
    past: [],
    present: undefined,
    timeline: [],
  };

  const timelineReducer = (state = initialState, action) => {
    const { past, present, timeline } = state;

    if (get(action, 'type') === JUMP) {
      if (!action.payload.locus) { return state; }
      const locusIndex = timeline.indexOf(action.payload.locus);

      // If point in timeline cannot be found do nothing
      if (locusIndex === -1) {
        return state;
      }

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

    // This is the first run or we are resetting
    if (timeline.length === 0 || get(action, 'type') === RESET) {
      const locus = uuid();

      return {
        past: [],
        present: newPresent,
        timeline: [locus],
      };
    }

    // If newPresent matches the old one, don't treat as a new point in the timeline
    if (present === newPresent) {
      return state;
    }

    // If excluded, we don't treat this as a new
    // point in the timeline, but we do update the state
    if (options.exclude(action)) {
      return {
        past,
        present: newPresent,
        timeline,
      };
    }

    const locus = uuid();

    return {
      past: [...past, present].slice(-options.limit),
      present: newPresent,
      timeline: [...timeline, locus].slice(-options.limit - 1),
    };
  };

  return timelineReducer;
};

export const actionTypes = {
  RESET,
};

export const actionCreators = {
  jump,
  reset,
};

export default createTimelineReducer;
