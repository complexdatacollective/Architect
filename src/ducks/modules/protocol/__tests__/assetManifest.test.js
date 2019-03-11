/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer, { actionCreators, actionTypes } from '../assetManifest';
import { importAsset } from '../../../../other/protocols';

jest.mock('../../../../other/protocols');

const mockState = {
  session: {
    activeProtocol: '3c70bbaf-7ef8-4fd9-afaf-6ecd318ecb09',
  },
  protocols: [
    { id: '3c70bbaf-7ef8-4fd9-afaf-6ecd318ecb09', workingPath: '/tmp/foo/bar', filePath: '/foo/bar' },
  ],
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
      name: 'baz.jpg',
    };

    const assetType = 'buzz';

    beforeEach(() => {
      importAsset.mockClear();
    });

    it('calls importAsset and fires complete action', () => {
      const store = getStore();

      return store.dispatch(actionCreators.importAsset(file, assetType))
        .then(() => {
          expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET);
          expect(log.mock.calls[1][0].type).toEqual(actionTypes.IMPORT_ASSET_COMPLETE);
          expect(importAsset.mock.calls).toEqual([['/tmp/foo/bar', file]]);
        });
    });

    it('when importAsset throws an error it fires failed action', () => {
      importAsset.mockImplementation(
        () =>
          new Promise(() => { throw new Error(); }),
      );

      const store = getStore();

      return store.dispatch(actionCreators.importAsset(file, assetType)).then(() => {
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET);
        expect(log.mock.calls[1][0].type).toEqual(actionTypes.IMPORT_ASSET_FAILED);
        expect(importAsset.mock.calls).toEqual([['/tmp/foo/bar', file]]);
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
