/* eslint-env jest */
import { vi, describe, it, expect } from 'vitest';
import * as assets from '../assets';
import mockState from '../../__tests__/testState.json';

// Mock electronBridge
vi.mock('@utils/electronBridge', () => ({
  pathSync: {
    join: (...args) => args.join('/'),
  },
}));

// Mock assetTools with vi.hoisted
const { mockGetNetworkVariables } = vi.hoisted(() => ({
  mockGetNetworkVariables: vi.fn(() => Promise.resolve([])),
}));

vi.mock('@app/utils/protocols/assetTools', () => ({
  getNetworkVariables: mockGetNetworkVariables,
  getGeoJsonVariables: vi.fn(() => Promise.resolve([])),
}));

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

      // Mock getNetworkVariables to return the expected variables
      mockGetNetworkVariables.mockResolvedValueOnce(['foo', 'bazz', 'fizz']);

      const expectedOptions = ['foo', 'bazz', 'fizz']
        .map((attribute) => ({ label: attribute, value: attribute }));

      const getNetworkAssetVariables = assets.makeGetNetworkAssetVariables(mockState);

      const result = await getNetworkAssetVariables(assetId, true);

      expect(result).toEqual(expectedOptions);
    });
  });
});
