/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { testing as loadActions } from '../protocols/load';
import { actionCreators as unbundleActions } from '../protocols/unbundle';
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

    it('Removes protocol on load error', () => {
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

    it('Adds protocol to list on unbundle', () => {
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/7' }));
      const state = store.getState();
      expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/7' });
    });

    it('Updates protocol meta on load success', (done) => {
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/1' }));
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/2' }));
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/3' }));

      const stateBefore = store.getState();

      expect(stateBefore[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/3' });

      setTimeout(() => {
        store.dispatch(loadActions.loadProtocolSuccess(
          {
            filePath: '/dev/null/mock/recent/path/2',
          },
          protocol,
        ));

        const stateAfter = store.getState();

        expect(stateAfter[0]).toMatchObject({
          filePath: '/dev/null/mock/recent/path/2',
          name: '2',
          description: 'lol',
          schemaVersion: 4,
        });

        done();
      }, 1);
    });

    it('Updates protocol meta on save success', (done) => {
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/1' }));
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/2' }));
      store.dispatch(unbundleActions.unbundleProtocolSuccess({ filePath: '/dev/null/mock/recent/path/3' }));

      const stateBefore = store.getState();

      expect(stateBefore[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/3' });

      setTimeout(() => {
        store.dispatch(loadActions.loadProtocolSuccess(
          {
            filePath: '/dev/null/mock/recent/path/2',
          },
          protocol,
        ));

        const stateAfter = store.getState();

        expect(stateAfter[0]).toMatchObject({
          filePath: '/dev/null/mock/recent/path/2',
          name: '2',
          description: 'lol',
          schemaVersion: 4,
        });

        done();
      }, 1);
    });
  });
});
