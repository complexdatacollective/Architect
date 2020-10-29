/* eslint-env jest */
import {
  getNarrativeVariables,
  getEdgesForSubject,
} from '../selectors';

const subject = {
  entity: 'node',
  type: '1234-1234-1234',
};

const mockCodebook = {
  node: {
    [subject.type]: {
      variables: {
        '1234-1234-1': {
          name: 'my layout',
          type: 'layout',
        },
        '1234-1234-2': {
          name: 'my category',
          type: 'categorical',
        },
        '1234-1234-3': {
          name: 'my boolean',
          type: 'boolean',
        },
      },
    },
  },
  edge: {
    '1234-5': {
      name: 'an edge',
      color: 'blue',
    },
  },
};

const mockState = {
  protocol: {
    present: {
      codebook: mockCodebook,
    },
  },
};

describe('NarrativePresets', () => {
  describe('selectors', () => {
    it('get narrative variables for node type', () => {
      expect.assertions(3);

      const {
        layoutVariablesForSubject,
        highlightVariablesForSubject,
        groupVariablesForSubject,
      } = getNarrativeVariables(mockState, subject);

      expect(layoutVariablesForSubject).toEqual([{
        value: '1234-1234-1',
        label: 'my layout',
        type: 'layout',
        isUsed: false,
      }]);

      expect(highlightVariablesForSubject).toEqual([{
        value: '1234-1234-3',
        label: 'my boolean',
        type: 'boolean',
        isUsed: false,
      }]);

      expect(groupVariablesForSubject).toEqual([
        {
          isUsed: false,
          value: '1234-1234-2',
          label: 'my category',
          type: 'categorical',
        },
      ]);
    });

    it('get edges for node type', () => {
      const result = getEdgesForSubject(mockState, subject);

      expect(result).toEqual([{
        value: '1234-5',
        label: 'an edge',
        color: 'blue',
      }]);
    });
  });
});
