/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionCreators as loadActions } from '../protocols/load';
import { actionCreators as bundleActions } from '../protocols/bundle';
import { actionCreators as unbundleActions, actionTypes as unbundleActionTypes } from '../protocols/unbundle';
import reducer from '../recentProtocols';

describe('recentProtocols', () => {
  describe('reducer', () => {
    let store;

    beforeEach(() => {
      store = createStore(reducer, applyMiddleware(thunk));
    });

    it('LOAD_PROTOCOL_SUCCESS updates timestamp and sorts recent protocols', (done) => {
      store.dispatch(bundleActions.bundleProtocolSuccess('/dev/null/mock/recent/path/1'));
      store.dispatch(bundleActions.bundleProtocolSuccess('/dev/null/mock/recent/path/2'));
      store.dispatch(bundleActions.bundleProtocolSuccess('/dev/null/mock/recent/path/3'));

      store.subscribe(() => {
        const state = store.getState();
        expect(state.length).toBe(3);
        expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/3' });
        expect(state[1]).toMatchObject({ filePath: '/dev/null/mock/recent/path/2' });
        expect(state[2]).toMatchObject({ filePath: '/dev/null/mock/recent/path/1' });

        done();
      });

      setTimeout(() => {
        store.dispatch(loadActions.loadProtocolSuccess({
          filePath: '/dev/null/mock/recent/path/2',
        }));
      }, 2);
    });

    it('EXPORT_PROTOCOL_SUCCESS adds to recentProtocolsList', (done) => {
      store.dispatch(bundleActions.bundleProtocolSuccess('/dev/null/mock/recent/path/1'));

      store.subscribe(() => {
        const state = store.getState();

        expect(state.length).toBe(2);
        expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/2' });
        expect(state[1]).toMatchObject({ filePath: '/dev/null/mock/recent/path/1' });

        done();
      });

      store.dispatch(bundleActions.bundleProtocolSuccess('/dev/null/mock/recent/path/2'));
    });

    it('IMPORT_PROTOCOL_SUCCESS adds to recentProtocolsList', (done) => {
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/1' }));

      store.subscribe(() => {
        const state = store.getState();

        expect(state.length).toBe(2);
        expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/2' });
        expect(state[1]).toMatchObject({ filePath: '/dev/null/mock/recent/path/1' });

        done();
      });

      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/2' }));
    });

    it(`${unbundleActionTypes.IMPORT_PROTOCOL_ERROR}`, () => {
      const missingFilePath = '/dev/null/non/existent';

      const initialState = [
        { filePath: missingFilePath },
        { filePath: '/dev/null/another/protocol' },
      ];

      const result = reducer(
        initialState,
        unbundleActions.unbundleProtocolError(new Error('File not found'), missingFilePath),
      );

      expect(result).toEqual([
        { filePath: '/dev/null/another/protocol' },
      ]);
    });
  });
});
