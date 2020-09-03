/* eslint-env jest */

import { readFile } from 'fs-extra';
import { getVariables } from '../networkAssetTools';

jest.mock('fs-extra');

const mockNodes = [
  { name: 'foo' },
  { another: 'bar' },
];

const validJsonFileWithNodes = {
  text: () => Promise.resolve(JSON.stringify({ nodes: mockNodes })),
  name: 'valid_foo_nodes.json',
};

const validCsvFile = {
  text: () => Promise.resolve('name, age, isFriend'),
  name: 'valid_foo.csv',
};

const files = [
  validJsonFileWithNodes,
  validCsvFile,
];

const getFile = path =>
  files.find(f => f.name === path);

readFile.mockImplementation(
  filePath =>
    getFile(filePath).text(),
);

describe('networkAssetTools', () => {
  it('collects json node types ', () =>
    expect(getVariables(validJsonFileWithNodes.name))
      .resolves.toEqual(['name', 'another']),
  );

  it('collects csv types', () =>
    expect(getVariables(validCsvFile.name))
      .resolves.toEqual(['name', 'age', 'isFriend']),
  );
});
