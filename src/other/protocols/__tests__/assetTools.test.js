/* eslint-env jest */

import { readFile, readJson } from 'fs-extra';
import { getNetworkVariables, validateNetworkAsset } from '../assetTools';

jest.mock('fs-extra');

const mockNodes = [
  { name: 'foo' },
  { another: 'bar' },
];

const validJsonFileWithNodes = {
  text: () => Promise.resolve(JSON.stringify({ nodes: mockNodes })),
  name: 'valid_foo_nodes.json',
};

const validJsonFileWithEdges = {
  text: () => Promise.resolve('{ "edges": [ { "type": "friend" } ] }'),
  name: 'valid_foo_edges.json',
};

const validCsvFile = {
  text: () => Promise.resolve('name, age, isFriend\nfoo,40,true'),
  name: 'valid_foo.csv',
};

const invalidJsonFile = {
  text: () => Promise.resolve('foo'),
  name: 'invalid_foo.json',
};

const invalidVariablesJson = {
  text: () => Promise.resolve('{ "nodes": [ { "foo bar": "foo", "bazz!": "buzz" } ] }'),
  name: 'invalid_variables.json',
};

const emptyJsonFile = {
  text: () => Promise.resolve('{ "foo": "bar" }'),
  name: 'empty_foo.json',
};

const emptyCsvFile = { text: () => Promise.resolve('foo'), name: 'empty_foo.csv' };

const invalidCsvVariableFile = { text: () => Promise.resolve('foo bar,bazz!\ntest,test'), name: 'invalid_variables.csv' };

const invalidCsvFile = {
  text: () => Promise.resolve('foo,bar,bazz\ncolmismatch,,,'),
  name: 'invalid_foo.csv',
};

const files = [
  emptyCsvFile,
  emptyJsonFile,
  invalidCsvFile,
  invalidCsvVariableFile,
  invalidJsonFile,
  invalidVariablesJson,
  validCsvFile,
  validJsonFileWithEdges,
  validJsonFileWithNodes,
];

const getFile = path =>
  files.find(f => f.name === path);

readFile.mockImplementation(
  filePath =>
    getFile(filePath).text(),
);

readJson.mockImplementation(
  filePath =>
    getFile(filePath).text().then(data => JSON.parse(data)),
);


describe('assetTools', () => {
  describe('getNetworkVariables', () => {
    it('collects json node types ', () =>
      expect(getNetworkVariables(validJsonFileWithNodes.name))
        .resolves.toEqual(['name', 'another']),
    );

    it('collects csv types', () =>
      expect(getNetworkVariables(validCsvFile.name))
        .resolves.toEqual(['name', 'age', 'isFriend']),
    );
  });

  describe('validateNetworkAsset', () => {
    it('passes for valid json ', () => {
      expect.assertions(2);

      return Promise.all([
        expect(validateNetworkAsset(validJsonFileWithNodes.name))
          .resolves.toBe(true),
        expect(validateNetworkAsset(validJsonFileWithEdges.name))
          .resolves.toBe(true),
      ]);
    });

    it('rejects for invalid/empty json', () => {
      expect.assertions(3);

      return Promise.all([
        expect(validateNetworkAsset(invalidJsonFile.name))
          .rejects.toThrow(Error),
        expect(validateNetworkAsset(emptyJsonFile.name))
          .rejects.toThrow(Error),
        expect(validateNetworkAsset(invalidVariablesJson.name))
          .rejects.toThrow(Error('Variable name not allowed ("foo bar", "bazz!"). Only letters, numbers and the symbols ._-: are supported.')),
      ]);
    });

    it('passes for valid csv', () => {
      expect.assertions(1);
      return expect(validateNetworkAsset(validCsvFile.name))
        .resolves.toBe(true);
    });

    it('rejects for invalid csv', () => {
      expect.assertions(3);

      return Promise.all([
        expect(validateNetworkAsset(invalidCsvFile.name))
          .rejects.toThrow(/column_mismatched/),
        expect(validateNetworkAsset(emptyCsvFile.name))
          .rejects.toThrow(Error),
        expect(validateNetworkAsset(invalidCsvVariableFile.name))
          .rejects.toThrow(Error('Variable name not allowed ("foo bar", "bazz!"). Only letters, numbers and the symbols ._-: are supported.')),
      ]);
    });
  });
});
