/* eslint-env jest */

import * as issues from '../issues';

const issueObject = {
  foo: 'bar',
  baz: [
    {
      buzz: 'foo',
      deeper: [
        { fizz: 'pop' },
        { buzz: 'pow' },
      ],
      beep: {
        boop: 'bop',
      },
    },
  ],
};

describe('utils/issues', () => {
  describe('flattenIssues()', () => {
    it('Converts a nested object into a flattened version with paths', () => {
      expect(
        issues.flattenIssues(issueObject),
      ).toEqual([
        { issue: 'bar', field: 'foo' },
        { issue: 'foo', field: 'baz[0].buzz' },
        { issue: 'pop', field: 'baz[0].deeper[0].fizz' },
        { issue: 'pow', field: 'baz[0].deeper[1].buzz' },
        { issue: 'bop', field: 'baz[0].beep.boop' },
      ]);
    });
  });
});
