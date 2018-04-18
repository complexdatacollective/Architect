/* eslint-env jest */

import reducer from '../variableRegistry';

describe('protocol.variableRegistry', () => {
  it('does nothing', () => {
    const noop = reducer(
      [],
      {},
    );

    expect(
      noop,
    ).toEqual([]);
  });
});
