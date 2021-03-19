/* eslint-env jest */
/* eslint-disable import/prefer-default-export */

import testState from './testState.json';
import developmentProtocol from '../../development-protocol/protocol.json';

export const getMockState = (mergeProps) => ({
  ...testState,
  protocol: {
    present: developmentProtocol,
  },
  ...mergeProps,
});

export const getThunkMocks = (state = testState) => {
  const getState = jest.fn(() => state);

  const dispatch = jest.fn((action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return action;
  });

  return [dispatch, getState];
};
