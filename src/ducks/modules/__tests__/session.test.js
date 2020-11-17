/* eslint-env jest */

import configureStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import reducer, { actionCreators } from '../session';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as stageActions } from '../protocol/stages';
import {
  actionCreators as codebookActions,
  testing as codebookTesting,
} from '../protocol/codebook';
import { testing as assetManifestTesting } from '../protocol/assetManifest';
import { rootEpic } from '../../modules/root';
import {
  createNetcanvasImport,
  readProtocol,
  createNetcanvasExport,
  verifyNetcanvas,
  deployNetcanvas,
} from '../../../utils/netcanvasFile';

jest.mock('../../../utils/netcanvasFile');

const epics = createEpicMiddleware(rootEpic);
const middlewares = [epics, thunk];
const mockStore = configureStore(middlewares);

const itTracksActionAsChange = (action) => {
  const store = mockStore({});

  store.dispatch(action);

  const actions = store.getActions();

  expect(actions.pop()).toEqual({ type: 'SESSION/PROTOCOL_CHANGED' });
};

describe('session module', () => {
  describe('reducer', () => {
    it('has an initial state', () => {
      expect(reducer(undefined))
        .toEqual({
          lastSaved: 0,
          lastChanged: 0,
          activeProtocolId: null,
          filePath: null,
          workingPath: null,
          backupPath: null,
        });
    });

    describe('PROTOCOL_CHANGED', () => {
      it('it updates the lastChanged value', () => {
        const result = reducer(
          undefined,
          actionCreators.protocolChanged(),
        );

        expect(result.lastChanged > 0).toBe(true);
      });

      it('tracks actions as changes', () => {
        const actions = [
          [stageActions.updateStage, [{}]],
          [stageActions.moveStage, [0, 0]],
          [stageActions.deleteStage, [0]],
          [protocolActions.updateOptions, [{}]],
          [codebookActions.createType],
          [codebookActions.updateType],
          [codebookTesting.deleteType],
          [codebookTesting.createVariable],
          [codebookTesting.updateVariable],
          [codebookTesting.deleteVariable],
          [assetManifestTesting.importAssetComplete],
          [assetManifestTesting.deleteAsset],
        ];

        actions.forEach(([action, args = []]) => {
          itTracksActionAsChange(action(...args));
        });
      });
    });

    it('SESSION/OPEN_NETCANVAS_SUCCESS updates state', () => {
      const initialState = reducer(undefined);
      const action = {
        type: 'SESSION/OPEN_NETCANVAS_SUCCESS',
        payload: {
          protocol: {},
          id: 'mock.protocol',
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
        },
      };
      expect(reducer(initialState, action))
        .toEqual({
          lastSaved: 0,
          lastChanged: 0,
          activeProtocolId: 'mock.protocol',
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
        });
    });

    it('SESSION/SAVE_NETCANVAS_SUCCESS updates state', () => {
      const initialState = reducer({
        lastSaved: 0,
        lastChanged: 0,
        activeProtocolId: 'mock.protocol',
        filePath: '/dev/null/mock.netcanvas',
        workingPath: '/dev/null/working/path',
      });

      const action = {
        type: 'SESSION/SAVE_NETCANVAS_SUCCESS',
        payload: {
          savePath: '/dev/null/mock.netcanvas',
          backupPath: '/dev/null/mock.netcanvas.backup',
          protocolId: 'mock.protocol',
        },
      };

      const resultState = reducer(initialState, action);

      expect(resultState)
        .toMatchObject({
          filePath: '/dev/null/mock.netcanvas',
          backupPath: '/dev/null/mock.netcanvas.backup',
        });

      const aSecondAgo = new Date().getTime() - 1000;
      expect(resultState.lastSaved).toBeGreaterThan(aSecondAgo);
    });
  });

  it('open netcanvas dispatches the correct actions and side-effects', async () => {
    const store = mockStore();
    createNetcanvasImport.mockResolvedValueOnce('/dev/null/working/path');
    readProtocol.mockResolvedValueOnce({});

    await store.dispatch(actionCreators.openNetcanvas('/dev/null/mock.netcanvas'));
    const actions = store.getActions();

    expect(createNetcanvasImport.mock.calls).toEqual([
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
        type: 'SESSION/OPEN_NETCANVAS_SUCCESS',
        payload: {
          protocol: {},
          filePath: '/dev/null/mock.netcanvas',
          workingPath: '/dev/null/working/path',
        },
      },
    ]);
  });

});
