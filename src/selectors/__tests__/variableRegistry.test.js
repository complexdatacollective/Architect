/* eslint-env jest */

import {
  getTypeUsageIndex,
  makeGetUsageForType,
} from '../variableRegistry';

const mockStateWithProtocol = {
  protocol: {
    present: {
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

describe('variableRegistry selectors', () => {
  it('getTypeUsageIndex()', () => {
    const result = getTypeUsageIndex(mockStateWithProtocol);

    expect(result)
      .toEqual(
        [
          {
            owner: { id: 'bar', type: 'form' },
            subject: { entity: 'node', type: 'foo' },
          },
          {
            owner: { id: 'bazz', type: 'stage' },
            subject: { entity: 'node', type: 'foo' },
          },
          {
            owner: { id: 'pip', type: 'stage' },
            subject: { entity: 'node', type: 'pop' },
          },
          {
            owner: { promptId: 'fizz', stageId: 'buzz', type: 'prompt' },
            subject: { entity: 'node', type: 'foo' },
          },
        ],
      );
  });

  it('makeGetUsageForType()', () => {
    const getUsageForType = makeGetUsageForType(mockStateWithProtocol);
    const result = getUsageForType('node', 'pop');

    expect(result)
      .toEqual([
        {
          owner: { id: 'pip', type: 'stage' },
          subject: { entity: 'node', type: 'pop' },
        },
      ]);
  });
});
