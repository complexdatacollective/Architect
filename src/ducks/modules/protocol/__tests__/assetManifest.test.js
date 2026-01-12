/* eslint-env jest */
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getThunkMocks, toHaveDispatched } from '@app/__tests__/testHelpers';
import testState from '@app/__tests__/testState.json';
import reducer, { actionCreators, test } from '../assetManifest';

// Mock the protocols module - use vi.hoisted to allow using the mock in vi.mock factory
const { mockImportAsset } = vi.hoisted(() => ({
  mockImportAsset: vi.fn(() => Promise.resolve('new-asset-path')),
}));

vi.mock('@app/utils/protocols', () => ({
  importAsset: mockImportAsset,
}));

expect.extend({
  toHaveDispatched,
});

describe('protocol/assetManifest', () => {
  describe('reducer', () => {
    it('IMPORT_ASSET_COMPLETE correctly updates state', () => {
      const result = reducer(null, test.importAssetComplete('uuid-file-location-in-protocol', 'my-original-filename.jpg', 'image'));
      // The reducer creates a new UUID, so we check that the structure matches
      const keys = Object.keys(result);
      expect(keys.length).toBe(1);
      expect(result[keys[0]]).toMatchObject({
        id: expect.any(String),
        name: 'my-original-filename.jpg',
        source: 'uuid-file-location-in-protocol',
        type: 'image',
      });
    });

    it('DELETE_ASSET correctly updates state', () => {
      const assetId = 'test-asset-id';
      const state = {
        [assetId]: {
          id: assetId,
          name: 'my-original-filename.jpg',
          source: 'uuid-file-location-in-protocol',
          type: 'image',
        },
      };
      const result = reducer(state, test.deleteAsset(assetId));
      expect(result).toEqual({});
    });
  });

  describe('actionCreators', () => {
    const file = {
      text: Promise.resolve('image/data'),
      name: 'bazz.jpg',
    };

    beforeEach(() => {
      mockImportAsset.mockClear();
      mockImportAsset.mockResolvedValue('new-asset-path');
    });

    it('importAsset() dispatches correct actions', async () => {
      const [dispatch, getState] = getThunkMocks(testState);

      await actionCreators.importAsset(file.name)(dispatch, getState);

      // Check that the correct actions were dispatched (id is a generated UUID)
      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/IMPORT_ASSET', filename: 'bazz.jpg' },
        { type: 'PROTOCOL/IMPORT_ASSET_COMPLETE', name: 'bazz.jpg' },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);

      // Verify that id was generated (should be a UUID string)
      const completeAction = dispatch.mock.calls.find(([call]) => call.type === 'PROTOCOL/IMPORT_ASSET_COMPLETE');
      expect(typeof completeAction[0].id).toBe('string');
      expect(completeAction[0].id.length).toBeGreaterThan(0);

      expect(mockImportAsset.mock.calls).toEqual([['/dev/null/1234-active-protocol', file.name]]);
    });

    it('importAsset() dispatches correct actions when util/importAsset fails', async () => {
      const [dispatch, getState] = getThunkMocks(testState);

      mockImportAsset.mockImplementationOnce(
        () => Promise.reject(new Error('Import failed')),
      );

      await actionCreators.importAsset(file.name)(dispatch, getState);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/IMPORT_ASSET', filename: 'bazz.jpg' },
        { type: 'PROTOCOL/OPEN_DIALOG' },
        { type: 'PROTOCOL/IMPORT_ASSET_FAILED' },
      ]);

      expect(mockImportAsset.mock.calls).toEqual([['/dev/null/1234-active-protocol', file.name]]);
    });

    it('deleteAsset() dispatches correct actions', async () => {
      const [dispatch, getState] = getThunkMocks(testState);
      const assetId = 'test-asset-id-for-delete';

      await actionCreators.deleteAsset(assetId)(dispatch, getState);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/DELETE_ASSET', id: assetId },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });
  });
});
