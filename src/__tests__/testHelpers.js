import { isMatch } from 'lodash';
import { vi } from 'vitest';

import developmentProtocol from '../../development-protocol/protocol.json';
import testState from './testState.json';

export const getMockState = (mergeProps) => ({
  ...testState,
  protocol: {
    present: developmentProtocol,
  },
  ...mergeProps,
});

export const getThunkMocks = (state = testState) => {
  const getState = vi.fn(() => state);

  const dispatch = vi.fn((action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return action;
  });

  return [dispatch, getState];
};

export const toHaveDispatched = (received, actions) => {
  if (!received.mock) {
    throw new Error('Must be called with vi.fn() or jest.fn()');
  }
  const dispatched = received.mock.calls.reduce((acc, [call]) => {
    if (call.type) {
      acc.push(call);
    }
    return acc;
  }, []);

  const error = actions.reduce((errorMessage, action, index) => {
    if (errorMessage) {
      return errorMessage;
    }
    if (!isMatch(dispatched[index], action)) {
      return `Expected actions to match (partial comparison)\n\nDispatched:\n${JSON.stringify(dispatched[index], null, 2)}\n\nMatcher:\n${JSON.stringify(action, null, 2)}`;
    }
    return null;
  }, null);

  if (!error) {
    return {
      message: () => 'expected dispatch mock to have been called with actions',
      pass: true,
    };
  }

  return {
    message: () => error,
    pass: false,
  };
};
