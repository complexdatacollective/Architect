/* eslint-env jest */
import { vi, describe, it, expect } from 'vitest';
import { getNetworkVariables, validateAsset } from '../assetTools';

const mockNodes = [
  { attributes: { name: 'foo' } },
  { attributes: { another: 'bar' } },
];

const validJsonFileWithNodes = {
  text: () => Promise.resolve(JSON.stringify({ nodes: mockNodes })),
  name: 'valid_foo_nodes.json',
};

const validJsonFileWithEdges = {
  text: () => Promise.resolve('{ "edges": [ { "attributes": { "type": "friend" } } ] }'),
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
  text: () => Promise.resolve('{ "nodes": [ { "attributes": { "foo bar": "foo", "bazz!": "buzz" } } ] }'),
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

const getFile = (path) => files.find((f) => f.name === path);

// Mock the electronBridge module
vi.mock('@utils/electronBridge', () => ({
  electronAPI: {
    fs: {
      readFile: vi.fn((filePath) => getFile(filePath).text()),
      readJson: vi.fn((filePath) => getFile(filePath).text().then((data) => JSON.parse(data))),
    },
    path: {
      extname: vi.fn((p) => {
        const ext = p.split('.').pop();
        return `.${ext}`;
      }),
    },
  },
}));

// Mock getSupportedAssetType
vi.mock('@app/utils/protocols/importAsset', () => ({
  getSupportedAssetType: vi.fn(async (filePath) => {
    const ext = filePath.split('.').pop();
    if (ext === 'json' || ext === 'csv') return 'network';
    return null;
  }),
}));

describe('assetTools', () => {
  describe('getNetworkVariables', () => {
    it('collects json node types ', () => expect(getNetworkVariables(validJsonFileWithNodes.name))
      .resolves.toEqual(['name', 'another']));

    it('collects csv types', () => expect(getNetworkVariables(validCsvFile.name))
      .resolves.toEqual(['name', 'age', 'isFriend']));
  });

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
      expect.assertions(3);

      return Promise.all([
        expect(validateAsset(invalidJsonFile.name))
          .rejects.toThrow(Error),
        expect(validateAsset(emptyJsonFile.name))
          .rejects.toThrow(Error),
        expect(validateAsset(invalidVariablesJson.name))
          .rejects.toThrow(/Variable name not allowed/),
      ]);
    });

    it('passes for valid csv', () => {
      expect.assertions(1);
      return expect(validateAsset(validCsvFile.name))
        .resolves.toBe(true);
    });

    it('rejects for invalid csv', () => {
      expect.assertions(3);

      return Promise.all([
        expect(validateAsset(invalidCsvFile.name))
          .rejects.toThrow(/column_mismatched/),
        expect(validateAsset(emptyCsvFile.name))
          .rejects.toThrow(Error),
        expect(validateAsset(invalidCsvVariableFile.name))
          .rejects.toThrow(/Variable name not allowed/),
      ]);
    });
  });
});
