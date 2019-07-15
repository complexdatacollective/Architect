/* eslint-env jest */

import { validateAsset } from '../importAsset';

const validJsonFile = new File(
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
    it('passes for valid json', () => {
      expect.assertions(1);
      return expect(validateAsset(validJsonFile))
        .resolves.toEqual(validJsonFile);
    });

    it('rejects for invalid json', () => {
      expect.assertions(1);
      return expect(validateAsset(invalidJsonFile))
        .rejects.toThrow(Error);
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
