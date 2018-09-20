/* eslint-env jest */

import {
  getTypeUsageIndex,
  makeGetUsageForType,
  getSociogramTypeUsageIndex,
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
  it('getSociogramTypeUsageIndex()', () => {
    const result = getSociogramTypeUsageIndex(mockStateWithProtocol);

    expect(result)
      .toEqual(
        [
          {
            owner: { promptId: 'bravo', stageId: 'alpha', type: 'prompt' },
            subject: { entity: 'edge', type: 'charlie' },
          }, {
            owner: { promptId: 'bravo', stageId: 'alpha', type: 'prompt' },
            subject: { entity: 'edge', type: 'delta' },
          }, {
            owner: { promptId: 'bravo', stageId: 'alpha', type: 'prompt' },
            subject: { entity: 'edge', type: 'echo' },
          },
        ],
      );
  });

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
          {
            owner: { promptId: 'bravo', stageId: 'alpha', type: 'prompt' },
            subject: { entity: 'edge', type: 'charlie' },
          }, {
            owner: { promptId: 'bravo', stageId: 'alpha', type: 'prompt' },
            subject: { entity: 'edge', type: 'delta' },
          }, {
            owner: { promptId: 'bravo', stageId: 'alpha', type: 'prompt' },
            subject: { entity: 'edge', type: 'echo' },
          },
        ],
      );
  });

  it('makeGetUsageForType()', () => {
    let result;
    const getUsageForType = makeGetUsageForType(mockStateWithProtocol);

    result = getUsageForType('node', 'pop');

    expect(result)
      .toEqual([
        {
          owner: { id: 'pip', type: 'stage' },
          subject: { entity: 'node', type: 'pop' },
        },
      ]);

    result = getUsageForType('node', 'foo');

    expect(result)
      .toEqual([
        {
          owner: { id: 'bar', type: 'form' },
          subject: { entity: 'node', type: 'foo' },
        },
        {
          owner: { id: 'bazz', type: 'stage' },
          subject: { entity: 'node', type: 'foo' },
        },
        {
          owner: { promptId: 'fizz', stageId: 'buzz', type: 'prompt' },
          subject: { entity: 'node', type: 'foo' },
        },
      ]);
  });
});
