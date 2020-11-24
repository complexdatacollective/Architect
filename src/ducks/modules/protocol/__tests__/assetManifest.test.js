/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { importAsset } from '@app/utils/protocols';
import reducer, { actionCreators, actionTypes } from '../assetManifest';

jest.mock('@app/utils/protocols');

const mockState = {
  session: {
    workingPath: '/tmp/foo/bar',
  },
};

const log = jest.fn();

const logger = () =>
  next =>
    (action) => {
      log(action);
      return next(action);
    };

const getStore = () =>
  createStore(
    state => state,
    mockState,
    applyMiddleware(thunk, logger),
  );

describe('protocol/assetManifest', () => {
  beforeEach(() => {
    log.mockClear();
  });

  describe('importAsset()', () => {
    const file = {
      text: Promise.resolve('image/data'),
      name: 'bazz.jpg',
    };

    beforeEach(() => {
      importAsset.mockClear();
    });

    it('calls importAsset and fires complete action', () => {
      const store = getStore();

      return store.dispatch(actionCreators.importAsset(file.name))
        .then(() => {
          expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET);
          expect(log.mock.calls[1][0].type).toEqual(actionTypes.IMPORT_ASSET_COMPLETE);
          expect(importAsset.mock.calls).toEqual([['/tmp/foo/bar', file.name]]);
        });
    });

    it('when importAsset throws an error it fires failed action', () => {
      importAsset.mockImplementation(
        () =>
          new Promise(() => { throw new Error(); }),
      );

      const store = getStore();

      return store.dispatch(actionCreators.importAsset(file.name)).then(() => {
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET);
        expect(log.mock.calls[2][0].type).toEqual(actionTypes.IMPORT_ASSET_FAILED);
        expect(importAsset.mock.calls).toEqual([['/tmp/foo/bar', file.name]]);
      });
    });
  });

  describe('importAssetComplete', () => {
    it('calls importAsset and fires complete action', () => {
      const filename = '577925e0e0f72582f4d2ea8ac29150057197aed4';
      const name = 'foo.jpg';
      const assetType = 'bar';

      const action = actionCreators.importAssetComplete(filename, name, assetType);

      const result = reducer(null, action);

      expect(result[action.id]).toMatchObject({
        id: action.id,
        name,
        source: filename,
        type: assetType,
      });
    });
  });
});
