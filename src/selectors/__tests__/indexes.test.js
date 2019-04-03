/* eslint-env jest */

import testState from '../../__tests__/testState.json';

import {
  getVariableIndex,
} from '../indexes';

describe('indexes selectors', () => {
  describe('getVariableIndex()', () => {
    it('extracts variables into index', () => {
      const subject = getVariableIndex(testState);

      expect(subject).toMatchSnapshot();
    });
  });
});
