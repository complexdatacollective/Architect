/* eslint-env jest */

import testState from '../../__tests__/testState.json';
import {
  getVariables,
} from '../codebook';

describe('codebook selectors', () => {
  describe('getVariables', () => {
    it('gets all variables from the codebook with meta data', () => {
      const variables = getVariables(testState);
      expect(variables).toMatchSnapshot();
    });
  });
});
