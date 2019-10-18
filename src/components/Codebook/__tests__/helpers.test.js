/* eslint-env jest */

import { getUsage, getUsageAsStageName } from '../helpers';

const state = {
  protocol: {
    present: {
      stages: [
        { label: 'foo' },
        { label: 'bar' },
        { label: 'bazz' },
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

it('getUsageAsStageName()', () => {
  const usage = ['stages[0].foo.bar', 'stages[0].foo.bar.bazz', 'stages[1].foo.bar.bazz'];
  const expectedResult = ['foo', 'bar'];
  expect(getUsageAsStageName(state, usage)).toEqual(expectedResult);
});
