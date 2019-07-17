/* eslint-env jest */

import { validateAsset } from '../importAsset';

const validJsonFileWithNodes = new File(
  ['{ "nodes": [ { "name": "foo" } ] }'],
  'foo.json',
  { type: 'application/json' },
);

const validJsonFileWithEdges = new File(
  ['{ "edges": [ { "type": "friend" } ] }'],
  'foo.json',
  { type: 'application/json' },
);

const emptyJsonFile = new File(
  ['{ "foo": "bar" }'],
  'foo.json',
  { type: 'application/json' },
);

const invalidJsonFile = new File(
  ['foo'],
  'foo.json',
  { type: 'application/json' },
);

const validCsvFile = new File(
  ['foo'],
  'foo.csv',
  { type: 'text/csv' },
);

const invalidCsvFile = new File(
  ['foo,bar,bazz\nonlyonecol'],
  'foo.csv',
  { type: 'text/csv' },
);

describe('importAsset', () => {
  describe('validateAsset', () => {
    it('passes for valid json ', () => {
      expect.assertions(2);

      return Promise.all([
        expect(validateAsset(validJsonFileWithNodes))
          .resolves.toEqual(validJsonFileWithNodes),
        expect(validateAsset(validJsonFileWithEdges))
          .resolves.toEqual(validJsonFileWithEdges),
      ]);
    });

    it('rejects for invalid/empty json', () => {
      expect.assertions(2);

      return Promise.all([
        expect(validateAsset(invalidJsonFile))
          .rejects.toThrow(Error),
        expect(validateAsset(emptyJsonFile))
          .rejects.toThrow(Error),
      ]);
    });

    it('passes for valid csv', () => {
      expect.assertions(1);
      return expect(validateAsset(validCsvFile))
        .resolves.toEqual(validCsvFile);
    });

    it('rejects for invalid csv', () => {
      expect.assertions(1);
      return expect(validateAsset(invalidCsvFile))
        .rejects.toThrow(Error);
    });
  });
});
