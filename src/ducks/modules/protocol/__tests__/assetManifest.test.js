/* eslint-env jest */

import uuid from 'uuid';
import { getThunkMocks, toHaveDispatched } from '@app/__tests__/helpers';
import testState from '@app/__tests__/testState.json';
import { importAsset } from '@app/utils/protocols';
import reducer, { actionCreators, test } from '../assetManifest';

expect.extend({
  toHaveDispatched,
});

jest.mock('@app/utils/protocols');

describe('protocol/assetManifest', () => {
  describe('reducer', () => {
    it('IMPORT_ASSET_COMPLETE correctly updates state', () => {
      const result = reducer(null, test.importAssetComplete('uuid-file-location-in-protocol', 'my-original-filename.jpg', 'image'));
      expect(result).toMatchObject({
        [uuid()]: {
          id: uuid(),
          name: 'my-original-filename.jpg',
          source: 'uuid-file-location-in-protocol',
          type: 'image',
        },
      });
    });

    it('DELETE_ASSET correctly updates state', () => {
      const state = {
        [uuid()]: {
          id: uuid(),
          name: 'my-original-filename.jpg',
          source: 'uuid-file-location-in-protocol',
          type: 'image',
        },
      };
      const result = reducer(state, test.deleteAsset(uuid()));
      expect(result).toEqual({});
    });
  });

  describe('actionCreators', () => {
    const file = {
      text: Promise.resolve('image/data'),
      name: 'bazz.jpg',
    };

    beforeEach(() => {
      importAsset.mockClear();
    });

    it('importAsset() dispatches correct actions', async () => {
      const [dispatch, getState] = getThunkMocks(testState);

      await actionCreators.importAsset(file.name)(dispatch, getState);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/IMPORT_ASSET', filename: 'bazz.jpg' },
        { type: 'PROTOCOL/IMPORT_ASSET_COMPLETE', name: 'bazz.jpg', id: uuid() },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);

      expect(importAsset.mock.calls).toEqual([['/dev/null/1234-active-protocol', file.name]]);
    });

    it('importAsset() dispatches correct actions when util/importAsset fails', async () => {
      const [dispatch, getState] = getThunkMocks(testState);

      importAsset.mockImplementationOnce(
        () => new Promise(() => { throw new Error(); }),
      );

      await actionCreators.importAsset(file.name)(dispatch, getState);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/IMPORT_ASSET', filename: 'bazz.jpg' },
        { type: 'PROTOCOL/OPEN_DIALOG' },
        { type: 'PROTOCOL/IMPORT_ASSET_FAILED' },
      ]);

      expect(importAsset.mock.calls).toEqual([['/dev/null/1234-active-protocol', file.name]]);
    });

    it('deleteAsset() dispatches correct actions', async () => {
      const [dispatch, getState] = getThunkMocks(testState);

      await actionCreators.deleteAsset(uuid())(dispatch, getState);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/DELETE_ASSET', id: uuid() },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });
  });
});
