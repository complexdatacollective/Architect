/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionCreators, actionTypes } from '../assets';
import { importAssetToProtocol } from '../../../../other/protocols';

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

describe('protocol/assets', () => {
  describe('importAsset()', () => {
    beforeEach(() => {
      importAssetToProtocol.mockClear();
      log.mockClear();
    });

    it('calls importAssetToProtocol and fires complete action', () => {
      const store = getStore();

      return store.dispatch(actionCreators.importAsset('baz.jpg'))
        .then(() => {
          expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET);
          expect(log.mock.calls[1][0].type).toEqual(actionTypes.IMPORT_ASSET_COMPLETE);
          expect(importAssetToProtocol.mock.calls).toEqual([['/tmp/foo/bar', 'baz.jpg']]);
        });
    });

    it('when importAssetToProtocol throws an error it fires failed action', () => {
      importAssetToProtocol.mockImplementation(
        () =>
          new Promise(() => { throw new Error(); }),
      );

      const store = getStore();

      return store.dispatch(actionCreators.importAsset('baz.jpg')).then(() => {
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET);
        expect(log.mock.calls[1][0].type).toEqual(actionTypes.IMPORT_ASSET_FAILED);
        expect(importAssetToProtocol.mock.calls).toEqual([['/tmp/foo/bar', 'baz.jpg']]);
      });
    });
  });
});
