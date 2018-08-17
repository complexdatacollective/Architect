/* eslint-env jest */

import reducer from '../session';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as stageActions } from '../protocol/stages';
import { actionCreators as registryActions } from '../protocol/variableRegistry';

const itTracksActionAsChange = (action) => {
  const createStageState = reducer(
    undefined,
    action,
  );

  expect(createStageState.lastChanged > 0).toBe(true);
};

describe('session reducer', () => {
  it('has an initial state', () => {
    expect(reducer(undefined))
      .toEqual({
        lastSaved: 0,
        lastChanged: 0,
        activeProtocol: null,
      });
  });

  describe('change tracking', () => {
    it('tracks create stage', () => {
      itTracksActionAsChange(stageActions.createStage({}));
    });

    it('tracks stage updates', () => {
      itTracksActionAsChange(stageActions.updateStage({}));
    });

    it('tracks delete stage', () => {
      itTracksActionAsChange(stageActions.deleteStage(0));
    });

    it('tracks update options', () => {
      itTracksActionAsChange(protocolActions.updateOptions({}));
    });

    it('tracks create type', () => {
      itTracksActionAsChange(registryActions.createType());
    });

    it('tracks update type', () => {
      itTracksActionAsChange(registryActions.updateType());
    });

    it('tracks delete type', () => {
      itTracksActionAsChange(registryActions.deleteType());
    });
  });
});
