/* eslint-env jest */

import reducer, { actionCreators, test } from '../stages';

const mockStages = [
  { id: 3, type: 'Information', label: 'Foo' },
  {
    id: 9,
    type: 'NameGenerator',
    label: 'Bar',
    prompts: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ],
  },
  { id: 5, type: 'OrdinalBin', label: 'Baz' },
];

describe('protocol.stages', () => {
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
        actionCreators.updateStage(9, updatedStage),
      );

      expect(
        updatedStages[1],
      ).toMatchObject({ label: 'Hello world', type: 'NameGenerator' });
    });

    it('Replaces stage object if overwrite is `true`', () => {
      const updatedStage = { something: 'different' };

      const updatedStages = reducer(
        mockStages,
        actionCreators.updateStage(9, updatedStage, true),
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
        actionCreators.deleteStage(9),
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
        actionCreators.deletePrompt(9, 2),
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
            { id: 1 },
            { id: 3 },
          ],
        },
        { id: 5, type: 'OrdinalBin', label: 'Baz' },
      ]);
    });
  });
});
