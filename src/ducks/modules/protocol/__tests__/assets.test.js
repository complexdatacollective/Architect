/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionCreators, actionTypes } from '../assets';
import { importAssetToProtocol } from '../../../../other/protocols';

jest.mock('../../../../other/protocols');

const mockState = {
  session: {
    activeProtocol: { workingPath: '/tmp/foo/bar', archivePath: '/foo/bar' },
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

describe('protocol/assets', () => {
  describe('importAsset()', () => {
    beforeEach(() => {
      importAssetToProtocol.mockClear();
      log.mockClear();
    });

    it('calls importAssetToProtocol and fires complete action', () => {
      const store = getStore();

      store.subscribe(() => {
        expect(importAssetToProtocol.mock.calls).toEqual([['/tmp/foo/bar', 'baz.jpg']]);
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET_COMPLETE);
      });

      return store.dispatch(actionCreators.importAsset('baz.jpg'));
    });

    it('when importAssetToProtocol throws an error it fires failed action', () => {
      importAssetToProtocol.mockImplementation(
        () =>
          new Promise(() => { throw new Error(); }),
      );

      const store = getStore();

      store.subscribe(() => {
        expect(importAssetToProtocol.mock.calls).toEqual([['/tmp/foo/bar', 'baz.jpg']]);
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.IMPORT_ASSET_FAILED);
      });

      return store.dispatch(actionCreators.importAsset('baz.jpg'));
    });
  });
});
