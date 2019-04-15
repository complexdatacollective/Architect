/* eslint-env jest */

import testState from '../../__tests__/testState.json';
import {
  getVariableOptionsForSubject,
} from '../codebook';

describe('codebook selectors', () => {
  describe('getVariableOptionsForSubject()', () => {
    it('extracts variables for nodeType into options list for node entity', () => {
      const subject = {
        type: 'bar',
        entity: 'node',
      };

      const result = getVariableOptionsForSubject(
        testState,
        subject,
      );

      expect(result).toMatchSnapshot();
    });

    it('extracts variables for nodeType into options list for ego entity', () => {
      const subject = {
        type: undefined,
        entity: 'ego',
      };

      const result = getVariableOptionsForSubject(
        testState,
        subject,
      );

      expect(result).toMatchSnapshot();
    });
  });
});
