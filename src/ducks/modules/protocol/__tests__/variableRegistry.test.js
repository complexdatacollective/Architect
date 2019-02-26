/* eslint-env jest */

import uuid from 'uuid';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { sortBy } from 'lodash/fp';
import { actionCreators as formActions } from '../forms';
import { actionCreators as stageActions } from '../stages';
import reducer, { actionTypes, actionCreators, testing } from '../variableRegistry';

jest.mock('uuid');

const sortByType = sortBy('type');

const mockStore = configureStore([thunk]);

const mockState = {
  node: {
    place: { foo: 'bar' },
    person: { hello: 'world' },
  },
  edge: { },
};

describe('protocol.variableRegistry', () => {
  it('does nothing', () => {
    const noop = reducer();
    expect(noop).toEqual({
      node: {},
      edge: {},
    });
  });

  describe('createType()', () => {
    const emptyState = {
      node: {},
      edge: {},
    };

    const typeOptions = { bazz: 'buzz' };

    it('dispatches the CREATE_TYPE action with a type id', () => {
      const store = mockStore(mockState);

      store.dispatch(actionCreators.createType(
        'node',
        {},
      ));

      const actions = store.getActions();

      expect(actions[0]).toMatchObject({
        type: actionTypes.CREATE_TYPE,
        meta: {
          type: uuid(),
        },
      });
    });

    it('updates the state correctly', () => {
      const store = mockStore(emptyState);

      store.dispatch(actionCreators.createType(
        'node',
        typeOptions,
      ));

      const actions = store.getActions();
      const action = actions[0];

      expect(
        reducer(emptyState, action),
      ).toEqual(
        {
          edge: {},
          node: {
            '809895df-bbd7-4c76-ac58-e6ada2625f9b': {
              bazz: 'buzz',
            },
          },
        },
      );
    });
  });

  it('updateType()', () => {
    const nextState = reducer(
      mockState,
      actionCreators.updateType(
        'node',
        'person',
        { bazz: 'buzz' },
      ),
    );

    expect(nextState).toEqual({
      node: {
        place: { foo: 'bar' },
        person: { bazz: 'buzz' },
      },
      edge: { },
    });
  });

  it('deleteType()', () => {
    const nextState = reducer(
      mockState,
      testing.deleteTypeAction('node', 'person'),
    );

    expect(nextState).toEqual({
      node: {
        place: { foo: 'bar' },
      },
      edge: { },
    });
  });

  it('deleteType() and delete related objects', () => {
    const mockStateWithProtocol = {
      protocol: {
        present: {
          stages: [
            {
              id: 'bazz',
              subject: { entity: 'node', type: 'foo' },
            },
            {
              id: 'buzz',
              prompts: [
                {
                  id: 'fizz',
                  subject: { entity: 'node', type: 'foo' },
                },
              ],
            },
          ],
          forms: {
            bar: {
              entity: 'node',
              type: 'foo',
            },
          },
        },
      },
    };

    const store = mockStore(mockStateWithProtocol);

    store.dispatch(actionCreators.deleteType('node', 'foo', true));

    const actions = store.getActions();

    const expectedActions = sortByType([
      testing.deleteTypeAction('node', 'foo'),
      stageActions.deleteStage('bazz'),
      stageActions.deletePrompt('buzz', 'fizz', true),
      formActions.deleteForm('bar'),
    ]);

    expect(sortByType(actions)).toEqual(expectedActions);
  });
});
