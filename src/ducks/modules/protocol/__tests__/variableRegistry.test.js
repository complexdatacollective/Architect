/* eslint-env jest */

import uuid from 'uuid';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { actionCreators as formActions } from '../forms';
import { actionCreators as stageActions } from '../stages';
import reducer, { actionCreators } from '../variableRegistry';

jest.mock('uuid');

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
      actionCreators.deleteType(
        'node',
        'person',
      ),
    );

    expect(nextState).toEqual({
      node: {
        place: { foo: 'bar' },
      },
      edge: { },
    });
  });

  it('deleteTypeAndRelatedObjects()', () => {
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

    store.dispatch(actionCreators.deleteTypeAndRelatedObjects('node', 'foo'));

    const actions = store.getActions();

    expect(actions).toEqual(expect.arrayContaining([
      actionCreators.deleteType('node', 'foo'),
      stageActions.deleteStage('bazz'),
      stageActions.deletePrompt('buzz', 'fizz', true),
      formActions.deleteForm('bar'),
    ]));
  });
});
