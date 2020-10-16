/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionCreators as loadActions } from '../protocols/load';
import { actionCreators as unbundleActions, actionTypes as unbundleActionTypes } from '../protocols/unbundle';
import reducer from '../recentProtocols';

const protocol = {
  description: 'lol',
  schemaVersion: 4,
};

describe('recentProtocols', () => {
  describe('reducer', () => {
    let store;

    beforeEach(() => {
      store = createStore(reducer, applyMiddleware(thunk));
    });

    it('LOAD_PROTOCOL_SUCCESS updates timestamp and sorts recent protocols', (done) => {
      store.dispatch(loadActions.loadProtocolSuccess({ filePath: '/dev/null/mock/recent/path/1' }, protocol));
      store.dispatch(loadActions.loadProtocolSuccess({ filePath: '/dev/null/mock/recent/path/2' }, protocol));
      store.dispatch(loadActions.loadProtocolSuccess({ filePath: '/dev/null/mock/recent/path/3' }, protocol));

      store.subscribe(() => {
        const state = store.getState();
        expect(state.length).toBe(3);

        expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/3' });
        expect(state[1]).toMatchObject({ filePath: '/dev/null/mock/recent/path/2' });
        expect(state[2]).toMatchObject({ filePath: '/dev/null/mock/recent/path/1' });

        done();
      });

      setTimeout(() => {
        store.dispatch(loadActions.loadProtocolSuccess(
          {
            filePath: '/dev/null/mock/recent/path/3',
          },
          protocol,
        ));
      }, 2);
    });

    it('LOAD_PROTOCOL_SUCCESS adds to recentProtocolsList', (done) => {
      store.dispatch(loadActions.loadProtocolSuccess({ filePath: '/dev/null/mock/recent/path/1' }, protocol));

      store.subscribe(() => {
        const state = store.getState();

        expect(state.length).toBe(2);
        expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/2' }, protocol);
        expect(state[1]).toMatchObject({ filePath: '/dev/null/mock/recent/path/1' }, protocol);

        done();
      });

      store.dispatch(loadActions.loadProtocolSuccess({ filePath: '/dev/null/mock/recent/path/2' }, protocol));
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
