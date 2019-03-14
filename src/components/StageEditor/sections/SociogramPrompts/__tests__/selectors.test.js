/* eslint-env jest */
import {
  getLayoutVariablesForNodeType,
  getHighlightVariablesForNodeType,
  getEdgesForNodeType,
} from '../selectors';

const nodeType = '1234-1234-1234';

const mockVariableRegistry = {
  node: {
    [nodeType]: {
      variables: {
        '1234-1234-1': {
          label: 'my layout',
          type: 'layout',
        },
        '1234-1234-2': {
          label: 'my category',
          type: 'categorical',
        },
        '1234-1234-3': {
          label: 'my boolean',
          type: 'boolean',
        },
      },
    },
  },
  edge: {
    '1234-5': {
      label: 'an edge',
      color: 'blue',
    },
  },
};

const mockState = {
  protocol: {
    present: {
      variableRegistry: mockVariableRegistry,
    },
  },
};

describe('NarrativePresets', () => {
  describe('selectors', () => {
    it('get layout variables for node type', () => {
      const result = getLayoutVariablesForNodeType(mockState, { nodeType });

      expect(result).toEqual([{
        value: '1234-1234-1',
        label: 'my layout',
        color: '',
      }]);
    });

    it('get highlight variables for node type', () => {
      const result = getHighlightVariablesForNodeType(mockState, { nodeType });

      expect(result).toEqual([{
        value: '1234-1234-3',
        label: 'my boolean',
        color: '',
      }]);
    });

    it('get edges for node type', () => {
      const result = getEdgesForNodeType(mockState, { nodeType });

      expect(result).toEqual([{
        value: '1234-5',
        label: 'an edge',
        color: 'blue',
      }]);
    });
  });
});
