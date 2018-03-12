/* eslint-env jest */

import reducer, { actionCreators } from '../stages';

describe('store.stages', () => {
  it('ADD_STAGE', () => {
    const newStage = { type: 'Foo' };

    const addStageToBlankState = reducer(
      [],
      actionCreators.addStage(newStage, 0),
    );
    expect(addStageToBlankState[0]).toMatchObject({ ...newStage });

    const addStageToFilledState = reducer(
      [{ id: 3 }, { id: 9 }, { id: 5 }],
      actionCreators.addStage(newStage, 2),
    );
    expect(addStageToFilledState[2]).toMatchObject({ ...newStage });
  });
});
