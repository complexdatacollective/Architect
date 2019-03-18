/* eslint-env jest */

import uuid from 'uuid';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { sortBy } from 'lodash/fp';
import { actionCreators as formActions } from '../forms';
import { actionCreators as stageActions } from '../stages';
import reducer, { actionTypes, actionCreators, testing } from '../codebook';

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
  describe('reducer', () => {
    it('initialState', () => {
      const initialState = reducer();

      expect(initialState).toEqual({
        node: {},
        edge: {},
      });
    });

    it('CREATE_TYPE', () => {
      const result = reducer(
        undefined,
        testing.createType('node', 'foo', { bar: 'bazz' }),
      );

      expect(result).toEqual({
        node: { foo: { bar: 'bazz' } },
        edge: {},
      });
    });

    it('UPDATE_TYPE', () => {
      const result = reducer(
        {
          node: { foo: { bar: 'bazz' } },
          edge: {},
        },
        actionCreators.updateType('node', 'foo', { fizz: 'pop' }),
      );

      expect(result).toEqual({
        node: { foo: { fizz: 'pop' } },
        edge: {},
      });
    });

    it('DELETE_TYPE', () => {
      const result = reducer(
        {
          node: { foo: { bar: 'bazz' } },
          edge: {},
        },
        testing.deleteType('node', 'foo'),
      );

      expect(result).toEqual({
        node: {},
        edge: {},
      });
    });

    it('CREATE_VARIABLE', () => {
      const result = reducer(
        {
          node: { foo: { variables: {} } },
          edge: {},
        },
        testing.createVariable('node', 'foo', 'bar', { baz: 'buzz' }),
      );

      expect(result).toEqual({
        node: { foo: { variables: { bar: { baz: 'buzz' } } } },
        edge: {},
      });
    });

    it('UPDATE_VARIABLE', () => {
      const result = reducer(
        {
          node: { foo: { variables: { bar: { baz: 'buzz' } } } },
          edge: {},
        },
        actionCreators.updateVariable('node', 'foo', 'bar', { fizz: 'pop' }),
      );

      expect(result).toEqual({
        node: { foo: { variables: { bar: { fizz: 'pop' } } } },
        edge: {},
      });
    });
  });

  describe('async actions', () => {
    describe('createType()', () => {
      it('dispatches the CREATE_TYPE action with a type id', () => {
        const store = mockStore(mockState);

        store.dispatch(actionCreators.createType(
          'node',
          { fizz: 'buzz' },
        ));

        const actions = store.getActions();

        expect(actions[0]).toMatchObject({
          type: actionTypes.CREATE_TYPE,
          meta: {
            entity: 'node',
            type: uuid(),
          },
          configuration: { fizz: 'buzz' },
        });
      });
    });

    describe('createVariable()', () => {
      it('dispatches the CREATE_VARIABLE action with a variable id', () => {
        const store = mockStore(mockState);

        store.dispatch(actionCreators.createVariable(
          'node',
          'foo',
          { fizz: 'buzz' },
        ));

        const actions = store.getActions();

        expect(actions[0]).toMatchObject({
          type: actionTypes.CREATE_VARIABLE,
          meta: {
            entity: 'node',
            type: 'foo',
            variable: uuid(),
          },
          configuration: { fizz: 'buzz' },
        });
      });
    });

    describe('deleteType()', () => {
      it('Dispatches delete actions for all related objects', () => {
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
          testing.deleteType('node', 'foo'),
          stageActions.deleteStage('bazz'),
          stageActions.deletePrompt('buzz', 'fizz', true),
          formActions.deleteForm('bar'),
        ]);

        expect(sortByType(actions)).toEqual(expectedActions);
      });
    });
  });
});
