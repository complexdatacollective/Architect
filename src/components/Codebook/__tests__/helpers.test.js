/* eslint-env jest */

import { getAllVariablesByUUID } from '../../../selectors/codebook';
import { getUsage, getUsageAsStageMeta } from '../helpers';

const state = {
  protocol: {
    present: {
      codebook: {
        ego: {
          variables: {
            1: {
              name: 'name',
              type: 'text',
            },
          },
        },
        node: {
          person: {
            variables: {
              2: {
                name: 'name',
                type: 'text',
              },
            },
          },
        },
        edge: {
          friend: {
            variables: {
              3: {
                name: 'name',
                type: 'text',
              },
            },
          },
        },
      },
      stages: [
        { label: 'foo', id: 'abcd', other: 'ignored' },
        { label: 'bar', id: 'efgh', other: 'ignored' },
        { label: 'bazz', id: 'ijkl', other: 'ignored' },
      ],
    },
  },
};

const index = {
  'stages[0].foo.bar': 'fizz',
  'stages[0].foo.bar.bazz': 'fizz',
  'stages[1].foo.bar.bazz': 'fizz',
  'stages[1].foo.bar': 'pop',
  'stages[2].foo.bar': 'pop',
};

it('getUsage() ', () => {
  const value = 'fizz';
  const expectedResult = ['stages[0].foo.bar', 'stages[0].foo.bar.bazz', 'stages[1].foo.bar.bazz'];
  expect(getUsage(index, value)).toEqual(expectedResult);
});

it('getUsageAsStageMeta()', () => {
  const usage = ['stages[0].foo.bar', 'stages[0].foo.bar.bazz', 'stages[1].foo.bar.bazz'];

  const mockStageMetaByIndex = [
    { label: 'foo', id: 'abcd' },
    { label: 'bar', id: 'efgh' },
    { label: 'bazz', id: 'ijkl' },
  ];

  const mockVariableMetaByIndex = getAllVariablesByUUID(state.protocol.present.codebook);

  const expectedResult = [
    { label: 'foo', id: 'abcd' },
    { label: 'bar', id: 'efgh' },
  ];
  expect(getUsageAsStageMeta(
    mockStageMetaByIndex,
    mockVariableMetaByIndex,
    usage,
  )).toEqual(expectedResult);
});
