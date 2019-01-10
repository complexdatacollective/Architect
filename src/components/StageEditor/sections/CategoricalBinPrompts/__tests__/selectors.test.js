/* eslint-env jest */
import {
  makeGetVariableOptions,
} from '../selectors';


const mockState = {
  protocol: {
    present: {
      variableRegistry: {
        node: {
          bar: {
            variables: {
              alpha: { name: 'ALPHA', type: 'text' },
              bravo: { name: 'BRAVO', type: 'text' },
              charlie: { name: 'CHARLIE', type: 'location' },
            },
          },
        },
      },
    },
  },
};

describe('CategoricalBin selectors', () => {
  describe('getVariableOptions()', () => {
    let getVariableOptions;

    beforeEach(() => {
      getVariableOptions = makeGetVariableOptions();
    });

    it('extracts variables for nodeType into options list', () => {
      const nodeType = 'bar';

      const mockProps = {
        nodeType,
      };

      expect(getVariableOptions(mockState, mockProps)).toEqual([
        { value: 'alpha', label: 'ALPHA', type: 'text' },
        { value: 'bravo', label: 'BRAVO', type: 'text' },
        { value: 'charlie', label: 'CHARLIE', type: 'location' },
      ]);
    });
  });
});
