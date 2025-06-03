/* eslint-env jest */

import { acceptsPaths, getRejectedExtensions, getAcceptsExtensions } from '../helpers';

// acceptsPaths = (accepts, paths) =>
// getRejectedExtensions = (accepts, paths) =>
// getAcceptsExtensions = accepts =>

describe('acceptsPaths(accepts, paths)', () => {
  it('given a list of file extensions, and a list of paths it checks all paths are valid', () => {
    const accepts = ['.foo', '.baz4', '.b3uzz'];
    const passingPaths = ['/tmp/file.foo', '/tmp/file.baz4', '/tmp/file.b3uzz'];
    const mixedCasePaths = ['/tmp/file.FOO', '/tmp/file.bAZ4'];
    const failingPaths = ['/tmp/file.foo', '/tmp/file.fizz'];

    expect(acceptsPaths(accepts, passingPaths)).toBe(true);
    expect(acceptsPaths(accepts, mixedCasePaths)).toBe(true);
    expect(acceptsPaths(accepts, failingPaths)).toBe(false);
  });
});

describe('getRejectedExtensions(accepts, paths)', () => {
  it('given a list of file extensions, and a list of paths it returns those that do not match', () => {
    const accepts = ['.foo', '.bar', '.baz4', '.b3uzz'];
    const passingPaths = ['/tmp/file.foo', '/tmp/file.bar', '/tmp/file.baz4', '/tmp/file.b3uzz'];
    const failingPaths = ['/tmp/file.foo', '/tmp/file.FIZZ', '/tmp/file.pop'];

    expect(getRejectedExtensions(accepts, passingPaths)).toEqual([]);
    expect(getRejectedExtensions(accepts, failingPaths)).toEqual(['.FIZZ', '.pop']);
  });
});

describe('getAcceptsExtensions(accepts)', () => {
  it('given a list of file extensions, it returns them without the "." (for the electron open file dialog)', () => {
    const accepts = ['.foo', '.bar', '.baz4', '.b3uzz'];

    expect(getAcceptsExtensions(accepts)).toEqual(['foo', 'bar', 'baz4', 'b3uzz']);
  });
});
