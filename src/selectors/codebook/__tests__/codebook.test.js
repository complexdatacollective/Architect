/* eslint-env jest */

import testState from '../../../__tests__/testState.json';
import {
  getVariableOptionsForSubject,
  getAllVariablesByUUID,
  makeGetVariable,
} from '..';

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

  describe('getAllVariablesByUUID()', () => {
    it('returns all variables by UUID', () => {
      const result = getAllVariablesByUUID(testState);

      expect(result).toMatchSnapshot();
    });

    it('handles missing codebook', () => {
      const result = getAllVariablesByUUID({});

      expect(result).toMatchSnapshot();
    });

    it('handles missing nodeTypes', () => {
      const result = getAllVariablesByUUID({
        codebook: {
          edgeTypes: {},
          ego: {},
        },
      });

      expect(result).toMatchSnapshot();
    });

    it('handles missing edgeTypes', () => {
      const result = getAllVariablesByUUID({
        codebook: {
          nodeTypes: {},
          ego: {},
        },
      });

      expect(result).toMatchSnapshot();
    });

    it('handles missing ego', () => {
      const result = getAllVariablesByUUID({
        codebook: {
          nodeTypes: {},
          edgeTypes: {},
        },
      });

      expect(result).toMatchSnapshot();
    });

    it('handles missing variables', () => {
      const result = getAllVariablesByUUID({
        codebook: {
          nodeTypes: {
            foo: {},
          },
          edgeTypes: {
            bar: {},
          },
          ego: {},
        },
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('makeGetVariable()', () => {
    it('returns a variable by UUID', () => {
      const result = makeGetVariable('foo')(testState);

      expect(result).toMatchSnapshot();
    });

    it('returns null if variable is not found', () => {
      const result = makeGetVariable('not found')(testState);

      expect(result).toBeNull();
    });

    it('returns error if codebook is not found', () => {
      expect(() => makeGetVariable('foo')({})).toThrow();
    });
  });
});
