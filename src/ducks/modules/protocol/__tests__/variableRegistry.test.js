/* eslint-env jest */

import reducer, { actionCreators } from '../variableRegistry';

const mockState = {
  node: { place: { foo: 'bar' } },
  edge: { },
};

describe('protocol.variableRegistry', () => {
  it('does nothing', () => {
    const noop = reducer();
    expect(noop).toEqual({});
  });

  it('updateType()', () => {
    const nextState = reducer(
      mockState,
      actionCreators.updateType(
        'node',
        'person',
        { bazz: 'buzz' },
      ),
    );

    expect(nextState).toEqual({
      node: {
        place: { foo: 'bar' },
        person: { bazz: 'buzz' },
      },
      edge: { },
    });
  });
});
