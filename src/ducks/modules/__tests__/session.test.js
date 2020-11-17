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

const epics = createEpicMiddleware(rootEpic);
const middlewares = [epics, thunk];
const mockStore = configureStore(middlewares);

const itTracksActionAsChange = (action) => {
  const store = mockStore({});

  store.dispatch(action);

  const actions = store.getActions();

  expect(actions.pop()).toEqual({ type: 'SESSION/PROTOCOL_CHANGED' });
};

describe('session reducer', () => {
  it('has an initial state', () => {
    expect(reducer(undefined))
      .toEqual({
        lastSaved: 0,
        lastChanged: 0,
        activeProtocol: null,
        filePath: null,
        workingPath: null,
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
});
