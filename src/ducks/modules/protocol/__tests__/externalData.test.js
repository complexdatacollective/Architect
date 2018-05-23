/* eslint-env jest */

import reducer from '../externalData';

describe('protocol.externalData', () => {
  it('does nothing', () => {
    const noop = reducer(
      {},
      {},
    );

    expect(
      noop,
    ).toEqual({});
  });
});
