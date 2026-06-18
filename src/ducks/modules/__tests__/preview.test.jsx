/* eslint-env jest */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import testState from '../../../__tests__/testState.json';
import { actionCreators } from '../preview';

jest.mock('../../../utils/previewDriver');

const mockStore = configureStore([thunk]);

describe('preview', () => {
  describe('previewStageFromForm()', () => {
    let store;

    beforeEach(() => {
      store = mockStore(testState);
    });

    it('dispatches previewDraft() for stage id', () => {
      actionCreators.previewDraft = jest.fn();

      store.dispatch(
        actionCreators.previewStageFromForm({ id: 'pip' }, 'draft-by-id'),
      );

      const actions = store.getActions();
      const draftStages = actions[0].draft.stages;
      const { stageIndex } = actions[0];

      expect(stageIndex).toBe(1);
      expect(draftStages).toMatchSnapshot();
    });

    it('dispatches previewDraft() for insert at index', () => {
      actionCreators.previewDraft = jest.fn();

      store.dispatch(
        actionCreators.previewStageFromForm(
          { insertAtIndex: 2 },
          'draft-insert-at-index',
        ),
      );

      const actions = store.getActions();
      const draftStages = actions[0].draft.stages;
      const { stageIndex } = actions[0];

      expect(stageIndex).toBe(2);
      expect(draftStages).toMatchSnapshot();
    });

    it('dispatches previewDraft() for insert at index 0', () => {
      actionCreators.previewDraft = jest.fn();

      store.dispatch(
        actionCreators.previewStageFromForm(
          { insertAtIndex: 0 },
          'draft-insert-at-index',
        ),
      );

      const actions = store.getActions();
      const draftStages = actions[0].draft.stages;
      const { stageIndex } = actions[0];

      expect(stageIndex).toBe(0);
      expect(draftStages).toMatchSnapshot();
    });

    it('dispatches previewDraft() for end of stages', () => {
      actionCreators.previewDraft = jest.fn();

      const state = store.getState();
      const expectedStageIndex = state.protocol.present.stages.length;

      store.dispatch(
        actionCreators.previewStageFromForm({}, 'draft-insert-at-end'),
      );

      const actions = store.getActions();
      const draftStages = actions[0].draft.stages;
      const { stageIndex } = actions[0];

      expect(stageIndex).toBe(expectedStageIndex);
      expect(draftStages).toMatchSnapshot();
    });
  });
});
