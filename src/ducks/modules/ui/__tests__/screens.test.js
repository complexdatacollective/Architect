/* eslint-env jest */

import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import reducer, { actionCreators, actionTypes } from '../screens';
import { actionTypes as sessionActionTypes } from '../../session';

const mockStore = configureStore([thunk]);

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

  describe('LOAD_PROTOCOL_SUCCESS', () => {
    it('resets screens', () => {
      const loadAction = { type: sessionActionTypes.OPEN_PROTOCOL_SUCCESS };
      const stateWithScreens = {
        ...initialState,
        screens: [
          {
            screen: 'bar',
            params: {
              foo: 'bar',
            },
          },
          {
            screen: 'foo',
            params: {
              bar: 'foo',
            },
          },
        ],
      };

      const subject = reducer(stateWithScreens, loadAction);

      expect(
        subject.screens,
      ).toEqual([]);
    });
  });

  describe('openScreen()', () => {
    it('creates an open screen action with the current locus', () => {
      const screenName = 'edit-stage';
      const params = { foo: 'bar' };

      const mockStoreState = {
        protocol: {
          timeline: ['locus1'],
        },
      };

      const store = mockStore(mockStoreState);

      store.dispatch(actionCreators.openScreen(screenName, params));

      const subject = store.getActions();

      expect(subject).toEqual(
        [
          {
            payload: {
              params: { foo: 'bar', locus: 'locus1' },
              root: false,
              screen: 'edit-stage',
            },
            type: 'UI/OPEN_SCREEN',
          },
        ],
      );
    });
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

      const openAction = ({
        type: actionTypes.OPEN_SCREEN,
        payload: {
          screen: screenName,
          params,
        },
      });
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

    const openAction = ({
      type: actionTypes.OPEN_SCREEN,
      payload: { screen: screenName },
    });
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
      const openAction = ({
        type: actionTypes.OPEN_SCREEN,
        payload: { screen: screenName },
      });
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
