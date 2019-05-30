const JUMP = 'TIMEMACHINE/JUMP';
const JUMP_BKWD = 'TIMEMACHINE/JUMP_BKWD';
const RESET = 'TIMEMACHINE/RESET';

const jump = locus => ({
  type: JUMP,
  payload: { locus },
});

const reset = () => ({
  type: RESET,
});

const defaultLimit = -1000;

const createTimemachine = (reducer, options) => {
  let locus = 0;
  const limit = (options.limit && -options.limit) || defaultLimit;

  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    timeline: [locus],
  };

  const timemachine = (state = initialState, action) => {
    const { past, present, timeline } = state;

    switch (action.type) {
      case RESET:
        return initialState;
      case JUMP_BKWD: {
        if (past.length === 0) { return state; }
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          timeline: timeline.slice(0, -1),
        };
      }
      case JUMP: {
        if (!action.payload.locus) { return state; }
        const locusIndex = timeline.indexOf(action.payload.locus);

        // the last point in the timeline is the present
        if (locusIndex === timeline.length - 1) {
          return {
            past,
            present,
            timeline,
          };
        }

        const newPresent = past[locusIndex];

        return {
          past: past.slice(0, locusIndex),
          present: newPresent,
          timeline: past.slice(0, locusIndex + 1),
        };
      }
      default: {
        const newPresent = reducer(present, action);

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

        locus += 1;

        return {
          past: [...past, present].slice(limit),
          present: newPresent,
          timeline: [...timeline, locus].slice(limit - 1),
        };
      }
    }
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
