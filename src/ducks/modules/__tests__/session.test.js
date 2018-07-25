/* eslint-env jest */

import reducer from '../session';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as stageActions } from '../protocol/stages';
import { actionCreators as registryActions } from '../protocol/variableRegistry';
import { openProtocolAction, saveComplete } from '../protocol/file';

const protocolMeta = { id: 'foo', archivePath: '/bar/buzz' };

const itTracksActionAsChange = (action) => {
  const createStageState = reducer(
    undefined,
    action,
  );

  expect(createStageState.lastChanged > 0).toBe(true);
}

describe('session reducer', () => {
  it('has an initial state', () => {
    expect(reducer(undefined))
      .toEqual({
        lastSaved: 0,
        lastChanged: 0,
        activeProtocol: {},
      });
  });

  describe('protocol actions', () => {
    it('updates when protocol is opened', () => {
      const newState = reducer(
        undefined,
        openProtocolAction(undefined, protocolMeta),
      );

      expect(newState)
        .toMatchObject({
          activeProtocol: protocolMeta,
          lastSaved: 0,
          lastChanged: 0,
        });
    });

    it('resets path when protocol is reset', () => {
      const newState = reducer(
        { lastSaved: 100, activeProtocol: protocolMeta },
        protocolActions.resetProtocol(),
      );

      expect(newState)
        .toMatchObject({
          activeProtocol: {},
          lastSaved: 0,
          lastChanged: 0,
        });
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

  describe('file actions', () => {
    it('tracks last saved when protocol saved', () => {
      const newState = reducer(
        undefined,
        saveComplete(),
      );

      expect(newState.lastSaved > 0).toBe(true);
    });
  });
});
