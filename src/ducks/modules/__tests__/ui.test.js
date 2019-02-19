/* eslint-env jest */

import reducer, { actionCreators } from '../ui';

describe('ui', () => {
  it('initialState', () => {
    expect(
      reducer(),
    ).toEqual({
      root: {
        screen: 'start',
        params: {},
      },
      screens: [],
      params: {},
    });
  });

  describe('OPEN_SCREEN', () => {
    const screenName = 'edit-stage';
    const params = { foo: 'bar' };

    describe('not root', () => {
      const openAction = actionCreators.openScreen(screenName, params);

      const subject = reducer(undefined, openAction);

      it('adds screen to the list (with params)', () => {
        expect(
          subject.screens,
        ).toEqual([
          {
            screen: screenName,
            params: { ...params },
          },
        ]);
      });
    });
  });

  describe('CLOSE_SCREEN', () => {
    const screenName = 'edit-stage';
    const params = { foo: 'bar' };

    const openAction = actionCreators.openScreen(screenName);
    const closeAction = actionCreators.closeScreen(screenName, params);

    const openState = reducer(undefined, openAction);
    const closeState = reducer(openState, closeAction);

    expect(openState.screens.length).toBe(1);

    it('sets params', () => {
      expect(
        closeState.params,
      ).toEqual({
        ...params,
      });
    });

    it('removes screen from the list', () => {
      expect(
        closeState.screens.length,
      ).toBe(0);
    });
  });

  describe('UPDATE_SCREEN', () => {
    const screenName = 'edit-stage';
    const params1 = { foo: 'bar' };
    const params2 = { bazz: 'buzz' };

    describe('not root', () => {
      const openAction = actionCreators.openScreen(screenName);
      const updateAction1 = actionCreators.updateScreen(screenName, params1);
      const updateAction2 = actionCreators.updateScreen(screenName, params2);

      const openState = reducer(undefined, openAction);
      const updateState1 = reducer(openState, updateAction1);
      const updateState2 = reducer(updateState1, updateAction2);

      expect(openState.screens.length).toBe(1);

      it('merges screen params', () => {
        const screenFirstUpdate = updateState1.screens
          .find(({ screen }) => screen === screenName);

        expect(
          screenFirstUpdate.params,
        ).toEqual({
          ...params1,
        });

        const screenSecondUpdate = updateState2.screens
          .find(({ screen }) => screen === screenName);

        expect(
          screenSecondUpdate.params,
        ).toEqual({
          ...params1,
          ...params2,
        });
      });
    });
  });
});
