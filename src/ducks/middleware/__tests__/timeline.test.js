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

const getRewindableReducer = (reducer = defaultReducer) =>
  createTimeline(reducer);

describe('timeline middleware', () => {
  let rewindableReducer;

  beforeEach(() => {
    rewindableReducer = getRewindableReducer();
  });

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
        state => rewindableReducer(state, {}),
        undefined,
      );

    expect(nextState.past.length).toBe(2);
    expect(nextState.timeline.length).toBe(3); // +1 includes name for present
  });

  it('can revert to a specific point on the timeline', () => {
    const nextState = times(10)
      .reduce(
        state => rewindableReducer(state, {}),
        undefined,
      );

    const rollbackState = rewindableReducer(nextState, actionCreators.jump(nextState.timeline[4]));

    expect(rollbackState.past).toEqual(nextState.past.slice(0, 4));
    expect(rollbackState.timeline).toEqual(nextState.timeline.slice(0, 5));
    expect(rollbackState.present).toEqual(nextState.past[4]);
  });
});
