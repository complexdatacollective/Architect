/* eslint-env jest */

import { readFile } from 'fs-extra';
import { validateAsset } from '../importAsset';

jest.mock('fs-extra');

const validJsonFileWithNodes = {
  text: () => Promise.resolve('{ "nodes": [ { "name": "foo" } ] }'),
  name: 'valid_foo_nodes.json',
};

const validJsonFileWithEdges = {
  text: () => Promise.resolve('{ "edges": [ { "type": "friend" } ] }'),
  name: 'valid_foo_edges.json',
};

const emptyJsonFile = {
  text: () => Promise.resolve('{ "foo": "bar" }'),
  name: 'empty_foo.json',
};

const invalidJsonFile = {
  text: () => Promise.resolve('foo'),
  name: 'invalid_foo.json',
};

const validCsvFile = {
  text: () => Promise.resolve('foo'),
  name: 'valid_foo.csv',
};

const invalidCsvVariableFile = { text: () => Promise.resolve('foo bar,bazz!'), name: 'invalid_variables.csv' };

const invalidCsvFile = {
  text: () => Promise.resolve('foo,bar,bazz\nonlyonecol'),
  name: 'invalid_foo.csv',
};

const files = [
  validJsonFileWithNodes,
  validJsonFileWithEdges,
  emptyJsonFile,
  invalidJsonFile,
  validCsvFile,
  invalidCsvFile,
  invalidCsvVariableFile,
];

const getFile = path =>
  files.find(f => f.name === path);

readFile.mockImplementation(
  filePath =>
    getFile(filePath).text(),
);

describe('importAsset', () => {
  describe('validateAsset', () => {
    it('passes for valid json ', () => {
      expect.assertions(2);

      return Promise.all([
        expect(validateAsset(validJsonFileWithNodes.name))
          .resolves.toBe(true),
        expect(validateAsset(validJsonFileWithEdges.name))
          .resolves.toBe(true),
      ]);
    });

    it('rejects for invalid/empty json', () => {
      expect.assertions(2);

      return Promise.all([
        expect(validateAsset(invalidJsonFile.name))
          .rejects.toThrow(Error),
        expect(validateAsset(emptyJsonFile.name))
          .rejects.toThrow(Error),
      ]);
    });

    it('passes for valid csv', () => {
      expect.assertions(1);
      return expect(validateAsset(validCsvFile.name))
        .resolves.toBe(true);
    });

    it('rejects for invalid csv', () => {
      expect.assertions(1);
      return expect(validateAsset(invalidCsvFile.name))
        .rejects.toThrow(Error);
    });

    it('rejects for invalid csv variable names', () => {
      // expect.assertions(1);
      return expect(validateAsset(invalidCsvVariableFile.name))
        .rejects.toThrow(Error('Variable name not allowed ("foo bar", "bazz!"). Only letters, numbers and the symbols ._-: are supported.'));
    });
  });
});
