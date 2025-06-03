/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { actionTypes as sessionActionTypes } from '../session';
import reducer from '../recentProtocols';

const protocol = {
  description: 'test description',
  schemaVersion: 4,
};

describe('recentProtocols', () => {
  describe('reducer', () => {
    let store;

    beforeEach(() => {
      store = createStore(reducer, applyMiddleware(thunk));
    });

    it('Removes protocol on open error', () => {
      const missingFilePath = '/dev/null/non/existent';

      const initialState = [
        { filePath: missingFilePath },
        { filePath: '/dev/null/another/protocol' },
      ];

      const result = reducer(
        initialState,
        {
          type: sessionActionTypes.OPEN_NETCANVAS_ERROR,
          payload: { filePath: missingFilePath },
        },
      );

      expect(result).toEqual([
        { filePath: '/dev/null/another/protocol' },
      ]);
    });

    it('Adds protocol to list on open', () => {
      store.dispatch({
        type: sessionActionTypes.OPEN_NETCANVAS_SUCCESS,
        payload: { filePath: '/dev/null/mock/recent/path/7', protocol },
      });
      const state = store.getState();
      expect(state[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/7' });
    });

    it('Updates existing protocol meta on open', (done) => {
      store.dispatch({
        type: sessionActionTypes.OPEN_NETCANVAS_SUCCESS,
        payload: { filePath: '/dev/null/mock/recent/path/1', protocol },
      });
      store.dispatch({
        type: sessionActionTypes.OPEN_NETCANVAS_SUCCESS,
        payload: { filePath: '/dev/null/mock/recent/path/2', protocol },
      });
      store.dispatch({
        type: sessionActionTypes.OPEN_NETCANVAS_SUCCESS,
        payload: { filePath: '/dev/null/mock/recent/path/3', protocol },
      });

      const stateBefore = store.getState();

      expect(stateBefore[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/3' });

      setTimeout(() => {
        store.dispatch({
          type: sessionActionTypes.OPEN_NETCANVAS_SUCCESS,
          payload: { filePath: '/dev/null/mock/recent/path/2', protocol },
        });

        const stateAfter = store.getState();

        expect(stateAfter[0]).toMatchObject({
          filePath: '/dev/null/mock/recent/path/2',
          name: '2',
          description: 'test description',
          schemaVersion: 4,
        });

        done();
      }, 1);
    });

    it('Updates protocol meta on save success', (done) => {
      store.dispatch({
        type: sessionActionTypes.SAVE_NETCANVAS_SUCCESS,
        payload: { savePath: '/dev/null/mock/recent/path/1', protocol },
      });
      store.dispatch({
        type: sessionActionTypes.SAVE_NETCANVAS_SUCCESS,
        payload: { savePath: '/dev/null/mock/recent/path/2', protocol },
      });
      store.dispatch({
        type: sessionActionTypes.SAVE_NETCANVAS_SUCCESS,
        payload: { savePath: '/dev/null/mock/recent/path/3', protocol },
      });

      const stateBefore = store.getState();

      expect(stateBefore[0]).toMatchObject({ filePath: '/dev/null/mock/recent/path/3' });

      setTimeout(() => {
        store.dispatch({
          type: sessionActionTypes.SAVE_NETCANVAS_SUCCESS,
          payload: { savePath: '/dev/null/mock/recent/path/2', protocol },
        });

        const stateAfter = store.getState();

        expect(stateAfter[0]).toMatchObject({
          filePath: '/dev/null/mock/recent/path/2',
          name: '2',
          description: 'test description',
          schemaVersion: 4,
        });

        done();
      }, 1);
    });
  });
});
