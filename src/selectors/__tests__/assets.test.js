/* eslint-env jest */

import fs from 'fs-extra';
import * as assets from '../assets';
import mockState from '../../__tests__/testState.json';

jest.mock('fs-extra');

describe('assets', () => {
  describe('getAssetPath()', () => {
    it('generates asset path using the assetManifest and protocol meta', () => {
      const assetId = '1234-asset-1';
      const path = assets.getAssetPath(mockState, assetId);

      expect(path).toEqual('/dev/null/1234-active-protocol/assets/1234-4567-asset-1');
    });
  });

  describe('readExternalData()', () => {
    const mockJsonData = [
      { label: 'Bob', name: 'Bob Jr' },
    ];

    const mockCSVData = 'label,name\nBob,"Bob Jr"\n';

    it('reads json data as json', async () => {
      fs.readJson.mockImplementationOnce(() => Promise.resolve(mockJsonData));
      const filePath = '/dev/null/my-asset.json';
      const result = await assets.readExternalData(filePath);
      expect(result).toEqual(mockJsonData);
    });

    it('reads csv data as json', async () => {
      fs.readFile.mockImplementationOnce(() => Promise.resolve(mockCSVData));
      const filePath = '/dev/null/my-asset.csv';
      const result = await assets.readExternalData(filePath);
      expect(result).toEqual(mockJsonData);
    });
  });

  describe('getVariablesFromExternalData', () => {
    it('converts list of objects into list of { label, value } objects from unique attributes', () => {
      const mockExternalData = [
        { foo: 'bar', bazz: 'buzz' },
        { foo: 'bar', fizz: 'pop' },
      ];

      const expectedOptions = ['foo', 'bazz', 'fizz']
        .map(attribute => ({ label: attribute, value: attribute }));

      const result = assets.getVariablesFromExternalData(mockExternalData);

      expect(result).toEqual(expectedOptions);
    });
  });
});
