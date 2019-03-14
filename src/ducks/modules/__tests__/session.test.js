/* eslint-env jest */

import configureStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import reducer, { actionCreators } from '../session';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as stageActions } from '../protocol/stages';
import { actionCreators as codebookActions, testing as codebookTesting } from '../protocol/codebook';
import { actionCreators as formActions } from '../protocol/forms';
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

    it('tracks stage updates as change', () => {
      itTracksActionAsChange(stageActions.updateStage({}));
    });

    it('tracks stage move as change', () => {
      itTracksActionAsChange(stageActions.moveStage(0, 0));
    });

    it('tracks delete stage as change', () => {
      itTracksActionAsChange(stageActions.deleteStage(0));
    });

    it('tracks update options as change', () => {
      itTracksActionAsChange(protocolActions.updateOptions({}));
    });

    it('tracks create type as change', () => {
      itTracksActionAsChange(codebookActions.createType());
    });

    it('tracks update type as change', () => {
      itTracksActionAsChange(codebookActions.updateType());
    });

    it('tracks delete type as change', () => {
      itTracksActionAsChange(codebookTesting.deleteType());
    });

    it('tracks create variable as change', () => {
      itTracksActionAsChange(codebookActions.createVariable());
    });

    it('tracks update variable as change', () => {
      itTracksActionAsChange(codebookActions.updateVariable());
    });

    it('tracks create form as change', () => {
      itTracksActionAsChange(formActions.createForm());
    });

    it('tracks update form as change', () => {
      itTracksActionAsChange(formActions.updateForm());
    });

    it('tracks delete form as change', () => {
      itTracksActionAsChange(formActions.deleteForm());
    });
  });
});
