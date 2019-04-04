/* eslint-env jest */

import testState from '../../__tests__/testState.json';

import {
  getVariableIndex,
  utils,
} from '../indexes';

describe('indexes selectors', () => {
  describe('getVariableIndex()', () => {
    it('extracts variables into index', () => {
      const subject = getVariableIndex(testState);

      expect(subject).toMatchSnapshot();
    });
  });

  describe('utils.buildSearch()', () => {
    it('correctly builds the Set', () => {
      const index1 = {
        foo: 1,
        bar: 2,
        bazz: 3,
        fizz: 4,
      };

      const index2 = {
        foo: 3,
        bar: 4,
        bazz: 5,
        fizz: 6,
      };

      const excludeList = [3];

      const search = utils.buildSearch([index1, index2], [excludeList]);

      expect(search).toEqual(new Set([1, 2, 4, 5, 6]));
    });
  });
});
