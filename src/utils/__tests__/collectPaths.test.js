/* eslint-env jest */

import collectPaths from '../collectPaths';

const testObject = {
  stages: [
    {
      prompts: [
        { variable: 'foo' },
        { variable: 'bar' },
      ],
    },
    {
      prompts: [
        { variable: 'bazz' },
      ],
      list: [
        'fizz',
        'buzz',
      ],
    },
  ],
};

describe('collectPaths', () => {
  it('can extract attributes', () => {
    const expectedResult = {
      'stages[0].prompts[0].variable': 'foo',
      'stages[0].prompts[1].variable': 'bar',
      'stages[1].prompts[0].variable': 'bazz',
    };
    const paths = collectPaths('stages[].prompts[].variable', testObject);

    expect(paths).toEqual(expectedResult);
  });

  it.skip('can extract arrays', () => {
    const expectedResult = {
      'stages[0].prompts[0].list[0]': 'fizz',
      'stages[0].prompts[1].list[1]': 'buzz',
    };
    const paths = collectPaths('stages[].list[]', testObject);

    expect(paths).toEqual(expectedResult);
  });
});
