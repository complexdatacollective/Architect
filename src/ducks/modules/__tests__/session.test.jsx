import { vi, describe, it, expect, beforeEach } from 'vitest';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Create mock functions with vi.hoisted for proper hoisting
const { mockImportNetcanvas, mockReadProtocol, mockSaveNetcanvas } = vi.hoisted(() => ({
  mockImportNetcanvas: vi.fn(),
  mockReadProtocol: vi.fn(),
  mockSaveNetcanvas: vi.fn(),
}));

vi.mock('@app/utils/netcanvasFile', () => ({
  importNetcanvas: mockImportNetcanvas,
  readProtocol: mockReadProtocol,
  saveNetcanvas: mockSaveNetcanvas,
}));

import reducer, { actionCreators } from '../session';

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
          protocolIsValid: false,
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
      expect(result.protocolIsValid).toBe(true);
    });

    it('SESSION/OPEN_NETCANVAS_SUCCESS', () => {
      const initialState = reducer({
        lastSaved: 1000,
        lastChanged: 2000,
        filePath: '/dev/null/previous.netcanvas',
        workingPath: '/dev/null/previous/working/path',
        protocolIsValid: false,
      });
      const action = {
        type: 'SESSION/OPEN_NETCANVAS_SUCCESS',
        payload: {
          protocol: {},
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
          protocolIsValid: true,
        },
      };
      expect(reducer(initialState, action))
        .toMatchObject({
          lastSaved: 0,
          lastChanged: 0,
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
          protocolIsValid: true,
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
      mockImportNetcanvas.mockReset();
      mockReadProtocol.mockReset();
      mockSaveNetcanvas.mockReset();
    });

    it('open netcanvas dispatches the correct actions and side-effects', async () => {
      const store = mockStore();
      mockImportNetcanvas.mockResolvedValueOnce('/dev/null/working/path');
      mockReadProtocol.mockResolvedValueOnce({});

      await store.dispatch(actionCreators.openNetcanvas('/dev/null/mock.netcanvas'));
      const actions = store.getActions();

      expect(mockImportNetcanvas.mock.calls).toEqual([
        ['/dev/null/mock.netcanvas'],
      ]);

      expect(mockReadProtocol.mock.calls).toEqual([
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
            protocolIsValid: false,
          },
        },
        {
          type: 'TIMELINE/RESET',
        },
      ]);
    });

    describe('save actions', () => {
      const getStore = (session = {}) => mockStore({
        session: {
          workingPath: '/dev/null/working/path',
          filePath: '/dev/null/user/file/path.netcanvas',
          ...session,
        },
        protocol: { present: { schemaVersion: 4 } },
      });

      const store = getStore();

      beforeEach(() => {
        mockSaveNetcanvas.mockImplementation((
          workingPath,
          protocol,
          savePath,
        ) => Promise.resolve(savePath));

        store.clearActions();
      });

      it('saveNetcanvas()', async () => {
        await store.dispatch(actionCreators.saveNetcanvas());
        const actions = store.getActions();

        expect(mockSaveNetcanvas.mock.calls).toEqual([
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

        expect(mockSaveNetcanvas.mock.calls).toEqual([
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
});
