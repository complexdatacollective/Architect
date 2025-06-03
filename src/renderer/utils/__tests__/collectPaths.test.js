/* eslint-env jest */

import collectPath, { collectMappedPath } from '../collectPaths';

const testObject = {
  stages: [
    {
      subject: { entity: 'node', type: 'node1' },
      prompts: [
        { variable: 'foo' },
        { variable: 'bar' },
      ],
    },
    {
      subject: { entity: 'edge', type: 'edge1' },
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

describe('collectPath', () => {
  it('can extract attributes', () => {
    const expectedResult = {
      'stages[0].prompts[0].variable': 'foo',
      'stages[0].prompts[1].variable': 'bar',
      'stages[1].prompts[0].variable': 'bazz',
    };
    const paths = collectPath('stages[].prompts[].variable', testObject);

    expect(paths).toEqual(expectedResult);
  });

  it('can extract arrays', () => {
    const expectedResult = {
      'stages[1].list[0]': 'fizz',
      'stages[1].list[1]': 'buzz',
    };
    const paths = collectPath('stages[].list[]', testObject);

    expect(paths).toEqual(expectedResult);
  });
});

describe('collectMappedPath', () => {
  it('a noop mapping function does nothing', () => {
    const expectedResult = {
      'stages[0].subject': { entity: 'node', type: 'node1' },
      'stages[1].subject': { entity: 'edge', type: 'edge1' },
    };

    const mappingFunction = (value, path) => [value, path];

    const paths = collectMappedPath('stages[].subject', testObject, mappingFunction);

    expect(paths).toEqual(expectedResult);
  });

  it('if the mapping function returns undefined it filters it from results', () => {
    const expectedResult = {
      'stages[0].subject': { entity: 'node', type: 'node1' },
    };

    const mappingFunction = (value, path) => {
      if (value.entity === 'edge') { return undefined; }
      return [value, path];
    };

    const paths = collectMappedPath('stages[].subject', testObject, mappingFunction);

    expect(paths).toEqual(expectedResult);
  });

  it('it uses the value from the mapping function in the results', () => {
    const expectedResult = {
      'stages[0].subject': 'node1',
    };

    const mappingFunction = (value, path) => {
      if (value.entity === 'edge') { return undefined; }
      return [value.type, path];
    };

    const paths = collectMappedPath('stages[].subject', testObject, mappingFunction);

    expect(paths).toEqual(expectedResult);
  });

  it('it uses the path from the mapping function in the results', () => {
    const expectedResult = {
      'stages[0].subject.fictional.path': 'node1',
    };

    const mappingFunction = (value, path) => {
      if (value.entity === 'edge') { return undefined; }
      return [value.type, `${path}.fictional.path`];
    };

    const paths = collectMappedPath('stages[].subject', testObject, mappingFunction);

    expect(paths).toEqual(expectedResult);
  });
});
