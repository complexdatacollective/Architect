/* eslint-env jest */

import { makeScreenMessageListener } from '../ui';

jest.mock('fs-extra');

const getStateWithMessage = (message = {}) => ({ ui: { screens: { message } } });

describe('ui', () => {
  describe('makeScreenMessageListener()', () => {
    const screenMessageListener = makeScreenMessageListener('mockScreenName');

    const initialState = getStateWithMessage();

    const messageForDifferentScreen = getStateWithMessage({
      screen: 'anotherScreen',
      params: { foo: 'bar' },
    });

    const messageForListenedToScreen = getStateWithMessage({
      screen: 'mockScreenName',
      params: { fizz: 'pop' },
    });

    it('when no message present it returns null', () => {
      expect(screenMessageListener(initialState)).toEqual(null);
    });

    it('when message is for another screen it returns null', () => {
      expect(screenMessageListener(messageForDifferentScreen)).toEqual(null);
    });

    it('when message is for our screen it returns params the first time it changes', () => {
      expect(screenMessageListener(messageForListenedToScreen)).toEqual({ fizz: 'pop' });
    });

    it('when message is for our screen it returns null for following calls', () => {
      expect(screenMessageListener(messageForListenedToScreen)).toEqual(null);
    });
  });
});
