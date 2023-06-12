/* eslint-env jest */

import { getUsage, getUsageAsStageMeta, getCodebookVariableIndexFromValidationPath } from '../helpers';

const state = {
  protocol: {
    present: {
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
  const expectedResult = [
    { label: 'foo', id: 'abcd' },
    { label: 'bar', id: 'efgh' },
  ];
  expect(getUsageAsStageMeta(state, usage)).toEqual(expectedResult);
});

it('getCodebookVariableIndexFromValidationPath()', () => {
  const testStrings = [
    "codebook.ego.variables[4b27bf9f-7058-4e74-84d8-2cc0bfd7d25c].validation.sameAs",
    "codebook.ego.variables[4b27bf9f-7058-4e74-84d8-2cc0bfd7d25c].validation.differentFrom",
    "codebook.node[nodeType].variables[variableType].validation.sameAs",
    "codebook.node[nodeType].variables[variableType].validation.differentFrom",
    "codebook.edge[edgeType].variables[4b27bf9f-7058-4e74-84d8-2cc0bfd7d25c].validation.sameAs",
    "codebook.edge[edgeType].variables[4b27bf9f-7058-4e74-84d8-2cc0bfd7d25c].validation.differentFrom",
  ];

  // Run the function for each string in the array
  testStrings.forEach((testString) => {
    expect(getCodebookVariableIndexFromValidationPath(testString)).toEqual('4b27bf9f-7058-4e74-84d8-2cc0bfd7d25c');
  }

});
