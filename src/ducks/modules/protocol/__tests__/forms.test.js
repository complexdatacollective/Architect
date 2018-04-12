/* eslint-env jest */

import reducer from '../forms';

describe('protocol.forms', () => {
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
