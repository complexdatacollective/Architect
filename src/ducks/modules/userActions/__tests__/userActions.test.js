/* eslint-env jest */

import {
  // actionCreators,
  actionLocks,
} from '../userActions';

describe('userActions', () => {
  it('exports actionLocks', () => {
    expect(actionLocks).toEqual(
      expect.objectContaining({
        loading: expect.any(Function),
        protocols: expect.any(Function),
        saving: expect.any(Function),
      }),
    );
  });

  describe('actions', () => {
    it.todo('openNetcanvas');
    it.todo('createNetcanvas');
    it.todo('saveAsNetcanvas');
    it.todo('saveNetcanvas');
  });
});
