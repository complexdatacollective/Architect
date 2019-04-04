/* eslint-env jest */

import {
  getTypeUsageIndex,
  makeGetUsageForType,
  makeGetDeleteImpact,
  getSociogramTypeUsageIndex,
} from '../usage';

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

describe('usage selectors', () => {
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
            owner: { promptId: 'golf', stageId: 'foxtrot', type: 'prompt' },
            subject: { entity: 'node', type: 'foo' },
          },
          {
            owner: { promptId: 'hotel', stageId: 'foxtrot', type: 'prompt' },
            subject: { entity: 'node', type: 'pop' },
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

  describe('makeGetUsageForType()', () => {
    const getUsageForType = makeGetUsageForType(mockStateWithProtocol);

    it('returns correct results for ["node", "pop"]', () => {
      const result = getUsageForType('node', 'pop');

      expect(result)
        .toEqual([
          {
            owner: { id: 'pip', type: 'stage' },
            subject: { entity: 'node', type: 'pop' },
          },
          {
            owner: { promptId: 'hotel', stageId: 'foxtrot', type: 'prompt' },
            subject: { entity: 'node', type: 'pop' },
          },
        ]);
    });

    it('returns correct results for ["node", "foo"]', () => {
      const result = getUsageForType('node', 'foo');

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
          {
            owner: { promptId: 'golf', stageId: 'foxtrot', type: 'prompt' },
            subject: { entity: 'node', type: 'foo' },
          },
        ]);
    });
  });

  it('makeGetDeleteImpact("node", "foo")', () => {
    const getDeleteImpact = makeGetDeleteImpact(mockStateWithProtocol);

    const result = getDeleteImpact('node', 'foo');

    expect(result)
      .toEqual([
        { id: 'bar', type: 'form' },
        { id: 'bazz', type: 'stage' },
        { id: 'buzz', type: 'stage' },
        { promptId: 'golf', stageId: 'foxtrot', type: 'prompt' },
      ]);
  });
});
