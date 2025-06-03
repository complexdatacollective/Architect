/* eslint-env jest */
import { getThunkMocks, toHaveDispatched } from '@app/__tests__/helpers';
import testState from '@app/__tests__/testState.json';
import reducer, { actionCreators, test } from '../stages';

expect.extend({
  toHaveDispatched,
});

const mockStages = [
  { id: 3, type: 'Information', label: 'Foo' },
  {
    id: 9,
    type: 'NameGenerator',
    label: 'Bar',
    prompts: [
      { id: 7 },
      { id: 3 },
      { id: 5 },
    ],
  },
  { id: 5, type: 'OrdinalBin', label: 'Baz' },
];

const mockState = { ...testState };
mockState.protocol.present.stages = [...mockStages];

describe('protocol.stages', () => {
  describe('reducer', () => {
    describe('CREATE_STAGE', () => {
      it('Creates a stage', () => {
        const newStage = { type: 'Foo' };

        const appendStageToState = reducer(
          mockStages,
          test.createStage(newStage),
        );
        expect(appendStageToState[3]).toMatchObject({ ...newStage });

        const addStageToExistingState = reducer(
          mockStages,
          test.createStage(newStage, 1),
        );
        expect(addStageToExistingState[1]).toMatchObject({ ...newStage });
      });
    });

    describe('UPDATE_STAGE', () => {
      it('Merges properties by default ', () => {
        const updatedStage = { label: 'Hello world' };

        const updatedStages = reducer(
          mockStages,
          test.updateStage(9, updatedStage),
        );

        expect(
          updatedStages[1],
        ).toMatchObject({ label: 'Hello world', type: 'NameGenerator' });
      });

      it('Replaces stage object if overwrite is `true`', () => {
        const updatedStage = { something: 'different' };

        const updatedStages = reducer(
          mockStages,
          test.updateStage(9, updatedStage, true),
        );

        expect(
          updatedStages[1],
        ).toEqual({ id: 9, something: 'different' });
      });
    });

    describe('DELETE_STAGE', () => {
      it('Deletes the stage with stageId', () => {
        const updatedStages = reducer(
          mockStages,
          test.deleteStage(9),
        );

        expect(
          updatedStages,
        ).toEqual([
          { id: 3, type: 'Information', label: 'Foo' },
          { id: 5, type: 'OrdinalBin', label: 'Baz' },
        ]);
      });
    });

    describe('DELETE_PROMPT', () => {
      it('Deletes the stage with stageId', () => {
        const updatedStages = reducer(
          mockStages,
          test.deletePrompt(9, 3),
        );

        expect(
          updatedStages,
        ).toEqual([
          { id: 3, type: 'Information', label: 'Foo' },
          {
            id: 9,
            type: 'NameGenerator',
            label: 'Bar',
            prompts: [
              { id: 7 },
              { id: 5 },
            ],
          },
          { id: 5, type: 'OrdinalBin', label: 'Baz' },
        ]);
      });
    });
  });

  describe('actionCreators', () => {
    it('createStage', async () => {
      const [dispatch] = getThunkMocks();

      await actionCreators.createStage({ type: 'Foo' })(dispatch);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/CREATE_STAGE' },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });

    it('updateStage', async () => {
      const [dispatch] = getThunkMocks(mockState);

      await actionCreators.updateStage(9, { label: 'new label' })(dispatch);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/UPDATE_STAGE', id: 9 },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });

    it('deleteStage', async () => {
      const [dispatch, getState] = getThunkMocks(mockState);

      await actionCreators.deleteStage(9)(dispatch, getState);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/DELETE_STAGE', id: 9 },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });

    it('moveStage', async () => {
      const [dispatch] = getThunkMocks();

      await actionCreators.moveStage(2, 1)(dispatch);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/MOVE_STAGE', oldIndex: 2, newIndex: 1 },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });

    it('deletePrompt', async () => {
      const [dispatch] = getThunkMocks();

      await actionCreators.deletePrompt(9, 3)(dispatch);

      expect(dispatch).toHaveDispatched([
        { type: 'PROTOCOL/DELETE_PROMPT', stageId: 9, promptId: 3 },
        { type: 'SESSION/PROTOCOL_CHANGED' },
      ]);
    });
  });
});
