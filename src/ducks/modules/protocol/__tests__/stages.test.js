/* eslint-env jest */

import reducer, { actionCreators } from '../stages';

const mockStages = [
  { id: 3, type: 'Information', label: 'Foo' },
  { id: 9, type: 'NameGenerator', label: 'Bar' },
  { id: 5, type: 'OrdinalBin', label: 'Baz' },
];

describe('protocol.stages', () => {
  describe('ADD_STAGE', () => {
    it('Adds a stage', () => {
      const newStage = { type: 'Foo' };

      const addStageToBlankState = reducer(
        [],
        actionCreators.addStage(newStage, 0),
      );
      expect(addStageToBlankState[0]).toMatchObject({ ...newStage });

      const addStageToFilledState = reducer(
        mockStages,
        actionCreators.addStage(newStage, 2),
      );
      expect(addStageToFilledState[2]).toMatchObject({ ...newStage });
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
});
