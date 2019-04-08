/* eslint-env jest */

import {
  getVariableOptionsForNodeType,
} from '../codebook';

const mockStateWithProtocol = {
  protocol: {
    present: {
      codebook: {
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
      stages: [
        {
          id: 'bazz',
          subject: { entity: 'node', type: 'foo' },
        },
        {
          id: 'pip',
          subject: { entity: 'node', type: 'pop' },
        },
        {
          id: 'buzz',
          prompts: [
            {
              id: 'fizz',
              subject: { entity: 'node', type: 'foo' },
            },
          ],
        },
        {
          id: 'foxtrot',
          prompts: [
            {
              id: 'golf',
              subject: { entity: 'node', type: 'foo' },
            },
            {
              id: 'hotel',
              subject: { entity: 'node', type: 'pop' },
            },
          ],
        },
        {
          id: 'alpha',
          type: 'Sociogram',
          prompts: [
            {
              id: 'bravo',
              edges: {
                creates: 'charlie',
                display: ['delta', 'echo'],
              },
            },
          ],
        },
        {
          id: 'mike',
          type: 'Sociogram',
          prompts: [
            {
              id: 'oscar',
            },
          ],
        },
      ],
      forms: {
        bar: {
          entity: 'node',
          type: 'foo',
        },
      },
    },
  },
};

describe('codebook selectors', () => {
  describe('getVariableOptionsForNodeType()', () => {
    it('extracts variables for nodeType into options list', () => {
      const nodeType = 'bar';
      const subject = getVariableOptionsForNodeType(
        mockStateWithProtocol,
        nodeType,
      );

      expect(subject).toEqual([
        { value: 'alpha', label: 'ALPHA', type: 'text' },
        { value: 'bravo', label: 'BRAVO', type: 'text' },
        { value: 'charlie', label: 'CHARLIE', type: 'location' },
      ]);
    });
  });
});
