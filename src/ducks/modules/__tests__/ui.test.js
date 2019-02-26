/* eslint-env jest */

import reducer, { actionCreators } from '../ui';

const initialState = {
  root: {
    screen: 'start',
    params: {},
  },
  screens: [],
  message: {},
};

describe('ui', () => {
  it('initialState', () => {
    expect(
      reducer(),
    ).toEqual(
      initialState,
    );
  });

  describe('OPEN_SCREEN', () => {
    const screenName = 'edit-stage';
    const params = { foo: 'bar' };

    describe('not root', () => {
      const initialStateWithMessage = {
        ...initialState,
        message: {
          screen: 'foo',
          params: { bar: 'bazz' },
        },
      };

      const openAction = actionCreators.openScreen(screenName, params);
      const subject = reducer(initialStateWithMessage, openAction);

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

      it('resets message', () => {
        expect(subject.message).toEqual({});
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

    it('sets message', () => {
      expect(
        closeState.message,
      ).toEqual({
        screen: screenName,
        params,
      });
    });

    it('removes screen from the list', () => {
      expect(
        closeState.screens.length,
      ).toBe(0);
    });

    describe('if params not set', () => {
      const closeActionNoParams = actionCreators.closeScreen(screenName);
      const closeStateNoParams = reducer(openState, closeActionNoParams);

      it("doesn't set message", () => {
        expect(
          closeStateNoParams.params,
        ).toEqual(
          openState.params,
        );
      });
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
