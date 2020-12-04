/* eslint-disable no-unused-vars */
/* eslint-env jest */
import configureStore from 'redux-mock-store';
import Rx from 'rxjs';
import { toArray } from 'rxjs/operators';
import { times } from 'lodash';
import thunk from 'redux-thunk';
import validateProtocol from '@app/utils/validateProtocol';
import {
  importNetcanvas,
  readProtocol,
  saveNetcanvas,
} from '@app/utils/netcanvasFile';
import reducer, { actionCreators, epics } from '../session';

jest.mock('@app/utils/netcanvasFile');
jest.mock('@app/utils/validateProtocol');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('session module', () => {
  describe('reducer', () => {
    it('initial state', () => {
      expect(reducer(undefined))
        .toEqual({
          lastSaved: 0,
          lastChanged: 0,
          filePath: null,
          workingPath: null,
        });
    });

    it('SESSION/PROTOCOL_CHANGED', () => {
      const result = reducer(
        undefined,
        {
          type: 'SESSION/PROTOCOL_CHANGED',
          protocolIsValid: true,
          ipc: true,
        },
      );

      expect(result.lastChanged > 0).toBe(true);
    });

    it('SESSION/OPEN_NETCANVAS_SUCCESS', () => {
      const initialState = reducer({
        lastSaved: 1000,
        lastChanged: 2000,
        filePath: '/dev/null/previous.netcanvas',
        workingPath: '/dev/null/previous/working/path',
      });
      const action = {
        type: 'SESSION/OPEN_NETCANVAS_SUCCESS',
        payload: {
          protocol: {},
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
        },
      };
      expect(reducer(initialState, action))
        .toMatchObject({
          lastSaved: 0,
          lastChanged: 0,
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
        });
    });

    it('SESSION/SAVE_NETCANVAS_SUCCESS', () => {
      const initialState = reducer({
        lastSaved: 0,
        lastChanged: 0,
        filePath: '/dev/null/mock.netcanvas',
        workingPath: '/dev/null/working/path',
      });

      const action = {
        type: 'SESSION/SAVE_NETCANVAS_SUCCESS',
        payload: {
          savePath: '/dev/null/mock.netcanvas',
        },
      };

      const resultState = reducer(initialState, action);

      expect(resultState)
        .toMatchObject({
          filePath: '/dev/null/mock.netcanvas',
        });

      const aSecondAgo = new Date().getTime() - 1000;
      expect(resultState.lastSaved).toBeGreaterThan(aSecondAgo);
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      importNetcanvas.mockReset();
      readProtocol.mockReset();
      saveNetcanvas.mockReset();
    });

    it('open netcanvas dispatches the correct actions and side-effects', async () => {
      const store = mockStore();
      importNetcanvas.mockResolvedValueOnce('/dev/null/working/path');
      readProtocol.mockResolvedValueOnce({});

      await store.dispatch(actionCreators.openNetcanvas('/dev/null/mock.netcanvas'));
      const actions = store.getActions();

      expect(importNetcanvas.mock.calls).toEqual([
        ['/dev/null/mock.netcanvas'],
      ]);

      expect(readProtocol.mock.calls).toEqual([
        ['/dev/null/working/path'],
      ]);

      expect(actions).toEqual([
        {
          type: 'SESSION/OPEN_NETCANVAS',
          payload: {
            filePath: '/dev/null/mock.netcanvas',
          },
        },
        {
          ipc: true,
          type: 'SESSION/OPEN_NETCANVAS_SUCCESS',
          payload: {
            protocol: {},
            filePath: '/dev/null/mock.netcanvas',
            workingPath: '/dev/null/working/path',
          },
        },
        {
          type: 'TIMELINE/RESET',
        },
      ]);
    });

    describe('save actions', () => {
      const getStore = (session = {}) =>
        mockStore({
          session: {
            workingPath: '/dev/null/working/path',
            filePath: '/dev/null/user/file/path.netcanvas',
            ...session,
          },
          protocol: { present: { schemaVersion: 4 } },
        });

      const store = getStore();

      beforeEach(() => {
        saveNetcanvas.mockImplementation((
          workingPath,
          protocol,
          savePath,
        ) => Promise.resolve(savePath));

        store.clearActions();
      });

      it('saveNetcanvas()', async () => {
        await store.dispatch(actionCreators.saveNetcanvas());
        const actions = store.getActions();

        expect(saveNetcanvas.mock.calls).toEqual([
          [
            '/dev/null/working/path',
            { schemaVersion: 4 },
            '/dev/null/user/file/path.netcanvas',
          ],
        ]);

        expect(actions).toEqual([
          {
            payload: {
              workingPath: '/dev/null/working/path',
              filePath: '/dev/null/user/file/path.netcanvas',
            },
            type: 'SESSION/SAVE_NETCANVAS',
          },
          {
            ipc: true,
            payload: {
              protocol: { schemaVersion: 4 },
              savePath: '/dev/null/user/file/path.netcanvas',
            },
            type: 'SESSION/SAVE_NETCANVAS_SUCCESS',
          },
        ]);
      });

      it('saveAsNetcanvas()', async () => {
        await store.dispatch(
          actionCreators.saveAsNetcanvas('/dev/null/user/file/new_path.netcanvas'),
        );
        const actions = store.getActions();

        expect(saveNetcanvas.mock.calls).toEqual([
          [
            '/dev/null/working/path',
            { schemaVersion: 4 },
            '/dev/null/user/file/new_path.netcanvas',
          ],
        ]);

        expect(actions).toEqual([
          {
            payload: {
              workingPath: '/dev/null/working/path',
              filePath: '/dev/null/user/file/new_path.netcanvas',
            },
            type: 'SESSION/SAVE_NETCANVAS_COPY',
          },
          {
            payload: {
              savePath: '/dev/null/user/file/new_path.netcanvas',
            },
            type: 'SESSION/SAVE_NETCANVAS_COPY_SUCCESS',
          },
        ]);
      });
    });
  });

  describe('epics', () => {
    const store = mockStore({
      protocol: {
        present: {},
      },
    });

    const getState = () => store.getState();

    beforeEach(() => {
      validateProtocol.mockReset();
    });

    it('tracks actions as changes', (done) => {
      validateProtocol.mockResolvedValue();

      const actions = [
        { type: 'DO_NOT_TRACK_AS_CHANGE' },
        { type: 'PROTOCOL/UPDATE_STAGE' },
        { type: 'PROTOCOL/MOVE_STAGE' },
        { type: 'PROTOCOL/DELETE_STAGE' },
        { type: 'PROTOCOL/UPDATE_OPTIONS' },
        { type: 'PROTOCOL/UPDATE_TYPE' },
        { type: 'PROTOCOL/CREATE_TYPE' },
        { type: 'PROTOCOL/DELETE_TYPE' },
        { type: 'PROTOCOL/UPDATE_VARIABLE' },
        { type: 'PROTOCOL/CREATE_VARIABLE' },
        { type: 'PROTOCOL/DELETE_VARIABLE' },
        { type: 'PROTOCOL/IMPORT_ASSET_COMPLETE' },
        { type: 'PROTOCOL/DELETE_ASSET' },
      ];

      const expectedTrackedActionsCount = actions.length - 1; // because of DO_NOT_TRACK_AS_CHANGE

      const expectedResult = times(
        expectedTrackedActionsCount,
        () => ({ ipc: true, protocolIsValid: true, type: 'SESSION/PROTOCOL_CHANGED' }),
      );

      epics(Rx.Observable.from(actions), { getState })
        .pipe(toArray())
        .subscribe((result) => {
          expect(result).toEqual(expectedResult);
          expect(validateProtocol.mock.calls.length).toEqual(expectedTrackedActionsCount);
          done();
        });
    });

    it('when protocol is invalid it tracks change with protocolIsValid = false', (done) => {
      validateProtocol.mockRejectedValue();

      const actions = [
        { type: 'PROTOCOL/UPDATE_STAGE' },
      ];

      epics(Rx.Observable.from(actions), { getState })
        .pipe(toArray())
        .subscribe((result) => {
          expect(result).toEqual([
            { ipc: true, protocolIsValid: false, type: 'SESSION/PROTOCOL_CHANGED' },
          ]);
          expect(validateProtocol.mock.calls.length).toEqual(actions.length);
          done();
        });
    });
  });
});
