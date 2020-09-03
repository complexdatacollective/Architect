/* eslint-env jest */

import { readFile } from 'fs-extra';
import { getVariables } from '../networkAssetTools';

jest.mock('fs-extra');

const mockNodes = [
  { name: 'foo' },
  { another: 'bar' },
];

const mockEdges = [
  { type: 'friend' },
  { since: 'forever' },
];

const validJsonFileWithNodes = {
  text: () => Promise.resolve(JSON.stringify({ nodes: mockNodes })),
  name: 'valid_foo_nodes.json',
};

const validJsonFileWithEdges = {
  text: () => Promise.resolve(JSON.stringify({ edges: mockEdges })),
  name: 'valid_foo_edges.json',
};

const validJsonFileWithBoth = {
  text: () => Promise.resolve(JSON.stringify({ nodes: mockNodes, edges: mockEdges })),
  name: 'valid_foo_edges.json',
};

const validCsvFile = {
  text: () => Promise.resolve('name, age, isFriend'),
  name: 'valid_foo.csv',
};

const files = [
  validJsonFileWithNodes,
  validJsonFileWithEdges,
  validCsvFile,
];

const getFile = path =>
  files.find(f => f.name === path);

readFile.mockImplementation(
  filePath =>
    getFile(filePath).text(),
);

describe('networkAssetTools', () => {
  it('collects json node types ', () => {
    return expect(getVariables(validJsonFileWithNodes.name))
      .resolves.toEqual(['name', 'another']);
  });

  it('collects json edge types', () => {
    return expect(getVariables(validJsonFileWithEdges.name))
      .resolves.toEqual(['type', 'since']);
  });


  it('collects csv types', () => {
    expect.assertions(1);
    return expect(getVariables(validCsvFile.name))
      .resolves.toEqual(['name', 'age', 'isFriend']);
  });
});
