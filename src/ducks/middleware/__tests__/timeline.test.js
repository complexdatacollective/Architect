/* eslint-env jest */

import { times } from 'lodash';
import uuid from 'uuid';
import crypto from 'crypto';
import createTimeline, { actionCreators } from '../timeline';

jest.mock('uuid');

uuid.mockImplementation(() => crypto.randomBytes(20).toString('hex'));

const defaultReducer = jest.fn(() => ({
  dummyState: true,
  randomProperty: crypto.randomBytes(20).toString('hex'),
}));

const getRewindableReducer = (
  reducer = defaultReducer, options = {},
) => createTimeline(reducer, options);

describe('timeline middleware', () => {
  let rewindableReducer;

  beforeEach(() => {
    rewindableReducer = getRewindableReducer();
  });

  describe('createTimeline middleware', () => {
    it('modifies an existing reducer to contain past present future', () => {
      const mockState = { foo: 'bar' };
      const reducer = () => mockState;
      const state = createTimeline(reducer)(undefined);

      expect(state).toEqual(
        expect.objectContaining({
          past: expect.any(Array),
          present: mockState,
          timeline: expect.any(Array),
        }),
      );
    });

    it('each subsequent call adds an event to the timeline', () => {
      const nextState = times(3)
        .reduce(
          (state) => rewindableReducer(state, {}),
          undefined,
        );

      expect(nextState.past.length).toBe(2);
      expect(nextState.timeline.length).toBe(3); // +1 includes name for present
    });

    it('each subsequent call adds an event to the timeline (unless state is unchanged)', () => {
      const initialState = { foo: 'bar' };
      const reducer = (state = initialState) => state;
      const timelineReducer = createTimeline(reducer);

      const nextState = times(3)
        .reduce(
          (state) => timelineReducer(state, {}),
          undefined,
        );

      expect(nextState.past.length).toBe(0);
      expect(nextState.timeline.length).toBe(1);
    });
  });

  describe('jump() action', () => {
    it('can revert to a specific point on the timeline', () => {
      const nextState = times(10)
        .reduce(
          (state) => rewindableReducer(state, {}),
          undefined,
        );

      const rollbackState = rewindableReducer(
        nextState,
        actionCreators.jump(nextState.timeline[4]),
      );

      expect(rollbackState.past).toEqual(nextState.past.slice(0, 4));
      expect(rollbackState.timeline).toEqual(nextState.timeline.slice(0, 5));
      expect(rollbackState.present).toEqual(nextState.past[4]);
    });

    it('if point does not exist it ignores action', () => {
      const nextState = times(10)
        .reduce(
          (state) => rewindableReducer(state, {}),
          undefined,
        );

      const rollbackState = rewindableReducer(
        nextState,
        actionCreators.jump('NON_EXISTENT_POINT'),
      );

      expect(rollbackState.past).toEqual(nextState.past);
      expect(rollbackState.timeline).toEqual(nextState.timeline);
      expect(rollbackState.present).toEqual(nextState.present);
    });
  });

  describe('reset() action', () => {
    it('can revert to an unused state', () => {
      const nextState = times(10)
        .reduce(
          (state) => rewindableReducer(state, {}),
          undefined,
        );

      const resetState = rewindableReducer(
        nextState,
        actionCreators.reset(),
      );

      expect(resetState).toEqual(
        expect.objectContaining({
          past: expect.any(Array),
          present: expect.anything(),
          timeline: expect.any(Array),
        }),
      );

      expect(nextState.timeline.length).toBe(10);
      expect(resetState.timeline.length).toBe(1);
      expect(resetState.past.length).toBe(0);
    });
  });

  describe('options', () => {
    describe('limit', () => {
      beforeEach(() => {
        const options = {
          limit: 3,
        };

        rewindableReducer = getRewindableReducer(undefined, options);
      });

      it('timeline is limited to 3 items', () => {
        const nextState = times(10)
          .reduce(
            (state) => rewindableReducer(state, {}),
            undefined,
          );

        expect(nextState.past.length).toBe(3);
        expect(nextState.timeline.length).toBe(4); // +1 includes name for present
      });
    });

    describe('filter', () => {
      const ignoredType = 'MUTATING_THE_TIMELINE';

      beforeEach(() => {
        const options = {
          exclude: (action) => action.type === ignoredType,
        };
        rewindableReducer = getRewindableReducer(undefined, options);
      });

      it('actions that are excluded do not create points on the timeline', () => {
        // Add some regular actions
        const nextState = times(3)
          .reduce(
            (state) => rewindableReducer(state, {}),
            undefined,
          );

        // Add some ignored actions
        const filteredState = times(3)
          .reduce(
            (state) => rewindableReducer(state, { type: ignoredType }),
            nextState,
          );

        expect(filteredState.past.length).toBe(2);
        expect(filteredState.timeline.length).toBe(3); // +1 includes name for present
      });
    });
  });
});
