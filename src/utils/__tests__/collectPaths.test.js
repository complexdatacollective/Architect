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
    },
  ],
  list: [
    'fizz',
    'buzz',
  ],
};

describe('collectPaths', () => {
  it('can extract variables', () => {
    const expectedResult = {
      'stages[0].prompts[0].variable': 'foo',
      'stages[0].prompts[1].variable': 'bar',
      'stages[1].prompts[0].variable': 'bazz',
    };
    const paths = collectPaths('stages[].prompts[].variable', testObject);

    expect(paths).toEqual(expectedResult);
  });

});
