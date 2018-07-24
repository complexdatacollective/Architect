/* eslint-env jest */

import reducer, { actionCreators } from '../variableRegistry';

const mockState = {
  node: {
    place: { foo: 'bar' },
    person: { hello: 'world' },
  },
  edge: { },
};

describe('protocol.variableRegistry', () => {
  it('does nothing', () => {
    const noop = reducer();
    expect(noop).toEqual({
      node: {},
      edge: {},
    });
  });

  it('createType()', () => {
    const nextState = reducer(
      {
        node: {},
        edge: {},
      },
      actionCreators.createType(
        'node',
        'person',
        { bazz: 'buzz' },
      ),
    );

    expect(nextState).toEqual({
      node: {
        person: { bazz: 'buzz' },
      },
      edge: { },
    });

    const unchangedState = reducer(
      mockState,
      actionCreators.createType(
        'node',
        'person',
        { bazz: 'buzz' },
      ),
    );

    expect(unchangedState).toEqual(mockState);
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

  it('deleteType()', () => {
    const nextState = reducer(
      mockState,
      actionCreators.deleteType(
        'node',
        'person',
      ),
    );

    expect(nextState).toEqual({
      node: {
        place: { foo: 'bar' },
      },
      edge: { },
    });
  });
});
