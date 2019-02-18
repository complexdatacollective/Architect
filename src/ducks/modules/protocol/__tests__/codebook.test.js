/* eslint-env jest */

import uuid from 'uuid';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { sortBy } from 'lodash/fp';
import { actionCreators as formActions } from '../forms';
import { actionCreators as stageActions } from '../stages';
import reducer, { actionCreators, testing } from '../codebook';

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

describe('protocol.codebook', () => {
  it('does nothing', () => {
    const noop = reducer();
    expect(noop).toEqual({
      node: {},
      edge: {},
    });
  });

  it('createType()', () => {
    const nextState = reducer(
      {
        node: {},
        edge: {},
      },
      actionCreators.createType(
        'node',
        { bazz: 'buzz' },
      ),
    );

    expect(nextState).toEqual({
      node: {
        [uuid()]: { bazz: 'buzz' },
      },
      edge: { },
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
