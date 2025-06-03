/* eslint-env jest */

import log from 'electron-log';
import { errors, handleError } from '../errors';

jest.mock('electron-log');

describe('netcanvasFile/errors', () => {
  describe('handleError(defaultError)', () => {
    beforeEach(() => {
      log.error.mockReset();
    });

    it('returns a function', () => {
      const errorHandler = handleError();

      expect(typeof errorHandler).toBe('function');
    });

    it('if error is undefined, it throws an error!', () => {
      const errorHandler = handleError();

      expect(() => errorHandler(undefined))
        .toThrow('No error to handle');
    });

    it('if error code is EACCES it returns error with friendlyCode IncorrectPermissions', () => {
      const errorHandler = handleError();
      const mockError = new Error();
      mockError.code = 'EACCES';
      try {
        errorHandler(mockError);
      } catch (e) {
        expect(e.friendlyCode).toBe(errors.IncorrectPermissions);
      }
    });

    it('if error code is ENOENT it returns error with friendlyCode IncorrectPermissions', () => {
      const errorHandler = handleError();
      const mockError = new Error();
      mockError.code = 'ENOENT';
      try {
        errorHandler(mockError);
      } catch (e) {
        expect(e.friendlyCode).toBe(errors.NotFound);
      }
    });

    it('if error code is something else it returns the default friendlyCode', () => {
      const errorHandler = handleError('ExampleCode');
      const mockError = new Error();
      try {
        errorHandler(mockError);
      } catch (e) {
        expect(e.friendlyCode).toBe('ExampleCode');
      }
    });

    it('logs the error', () => {
      const errorHandler = handleError('ExampleCode');
      const mockError = new Error();
      try {
        errorHandler(mockError);
      } catch (e) {
        expect(log.error.mock.calls).toEqual([[mockError]]);
      }
    });
  });
});
