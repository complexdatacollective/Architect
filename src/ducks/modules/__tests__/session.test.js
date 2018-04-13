/* eslint-env jest */

import reducer from '../session';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as stageActions } from '../protocol/stages';
import { actionCreators as fileActions } from '../protocol/file';

describe('session reducer', () => {
  it('has an initial state', () => {
    expect(reducer(undefined))
      .toEqual({
        lastSaved: 0,
        lastChanged: 0,
        activeProtocol: '',
      });
  });

  describe('protocol actions', () => {
    it('updates path when protocol is set', () => {
      const newState = reducer(
        undefined,
        protocolActions.setProtocol(undefined, '/bar/buzz'),
      );

      expect(newState)
        .toMatchObject({
          activeProtocol: '/bar/buzz',
        });
    });

    it('resets path when protocol is reset', () => {
      const newState = reducer(
        { lastSaved: 100, activeProtocol: '/bar/buzz' },
        protocolActions.resetProtocol(),
      );

      expect(newState)
        .toMatchObject({
          activeProtocol: '',
        });
    });
  });

  describe('change tracking', () => {
    it('tracks changes on ADD_STAGE and UPDATE_STAGE', () => {
      const addStageState = reducer(
        undefined,
        stageActions.addStage({}),
      );

      expect(addStageState.lastChanged > 0).toBe(true);

      const updateStageState = reducer(
        undefined,
        stageActions.updateStage({}),
      );

      expect(updateStageState.lastChanged > 0).toBe(true);
    });
  });

  describe('file actions', () => {
    it('tracks last saved when protocol saved', () => {
      const newState = reducer(
        undefined,
        fileActions.saveComplete(),
      );

      expect(newState.lastSaved > 0).toBe(true);
    });
  });
});
