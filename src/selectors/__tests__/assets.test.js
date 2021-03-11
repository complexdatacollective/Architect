/* eslint-env jest */

import { readFile, readJson } from 'fs-extra';
import * as assets from '../assets';
import mockState from '../../__tests__/testState.json';

jest.mock('fs-extra');

const fs = {
  fileData: '',
};

readFile.mockImplementation(() => fs.fileData);

readJson.mockImplementation(() => fs.fileData);

describe('assets', () => {
  describe('getAssetPath()', () => {
    it('generates asset path using the assetManifest and protocol meta', () => {
      const assetId = '1234-asset-1';
      const path = assets.getAssetPath(mockState, assetId);

      expect(path).toEqual('/dev/null/1234-active-protocol/assets/1234-4567-asset-1');
    });
  });

  describe('makeGetNetworkAssetVariables', () => {
    it('converts list of objects into list of { label, value } objects from unique attributes', async () => {
      const assetId = '1234-asset-6';
      fs.fileData = {
        nodes: [
          { attributes: { foo: 'bar', bazz: 'buzz' } },
          { attributes: { foo: 'bar', fizz: 'pop' } },
        ],
      };

      const expectedOptions = ['foo', 'bazz', 'fizz']
        .map((attribute) => ({ label: attribute, value: attribute }));

      const getNetworkAssetVariables = assets.makeGetNetworkAssetVariables(mockState);

      const result = await getNetworkAssetVariables(assetId, true);

      expect(result).toEqual(expectedOptions);
    });
  });
});
