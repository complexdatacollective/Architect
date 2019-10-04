/* eslint-env jest */

import uuid from 'uuid';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { sortBy } from 'lodash/fp';
import testState from '@app/__tests__/testState.json';
import { actionCreators as stageActions } from '../stages';
import reducer, { actionTypes, actionCreators, testing } from '../codebook';

jest.mock('uuid');

const sortByType = sortBy('type');

const mockStore = configureStore([thunk]);

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
        node: { foo: { bar: 'bazz', color: '', variables: {} } },
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

    describe('CREATE_VARIABLE', () => {
      it('CREATE_VARIABLE for node entity', () => {
        const result = reducer(
          {
            node: { foo: { variables: {} } },
            edge: {},
          },
          testing.createVariable('node', 'foo', 'bar', { baz: 'buzz' }),
        );

        expect(result).toMatchSnapshot();
      });

      it('CREATE_VARIABLE for ego entity', () => {
        const result = reducer(
          {
            ego: { variables: {} },
          },
          testing.createVariable('ego', undefined, 'bar', { baz: 'buzz' }),
        );

        expect(result).toMatchSnapshot();
      });
    });

    describe('UPDATE_VARIABLE', () => {
      it('UPDATE_VARIABLE for node entity', () => {
        const result = reducer(
          {
            node: { foo: { variables: { bar: { baz: 'buzz' } } } },
            edge: {},
          },
          testing.updateVariable('node', 'foo', 'bar', { fizz: 'pop' }),
        );

        expect(result).toMatchSnapshot();
      });

      it('UPDATE_VARIABLE for ego entity', () => {
        const result = reducer(
          {
            ego: { variables: { bar: { baz: 'buzz' } } },
          },
          testing.updateVariable('ego', undefined, 'bar', { fizz: 'pop' }),
        );

        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('DELETE_VARIABLE', () => {
    it('DELETE_VARIABLE for node entity', () => {
      const result = reducer(
        {
          node: { foo: { variables: { bar: { baz: 'buzz' } } } },
          edge: {},
        },
        testing.deleteVariable('node', 'foo', 'bar'),
      );

      expect(result).toMatchSnapshot();
    });

    it.skip('DELETE_VARIABLE for ego entity', () => {
      const result = reducer(
        {
          ego: { variables: { bar: { baz: 'buzz' } } },
          edge: {},
        },
        testing.deleteVariable('ego', undefined, 'bar'),
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('async actions', () => {
    describe('createType()', () => {
      it('dispatches the CREATE_TYPE action with a type id', () => {
        const store = mockStore(testState);

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
      it('It will not create a variable with no name', () => {
        const createAction = actionCreators.createVariable('node', 'bar', { foo: 'bar' });
        const store = mockStore(testState);

        expect(() => {
          store.dispatch(createAction);
        }).toThrow(new Error('Cannot create a new variable without a name'));
      });

      it('It will not create a variable with no type', () => {
        const createAction = actionCreators.createVariable(
          'node',
          'bar',
          { foo: 'bar', name: 'bazz' },
        );
        const store = mockStore(testState);

        expect(() => {
          store.dispatch(createAction);
        }).toThrow(new Error('Cannot create a new variable without a type'));
      });

      it('dispatches the CREATE_VARIABLE action with a variable id for node', () => {
        const store = mockStore(testState);

        store.dispatch(actionCreators.createVariable(
          'node',
          'foo',
          { fizz: 'buzz', name: 'bar', type: 'text' },
        ));

        const actions = store.getActions();

        expect(actions[0]).toMatchSnapshot();
      });

      it('dispatches the CREATE_VARIABLE action with a variable id for ego', () => {
        const store = mockStore(testState);

        store.dispatch(actionCreators.createVariable(
          'ego',
          undefined,
          { fizz: 'buzz', name: 'bar', type: 'text' },
        ));

        const actions = store.getActions();

        expect(actions[0]).toMatchSnapshot();
      });

      it('throws an error if a variable with the same name already exists', () => {
        const createAction = actionCreators.createVariable('node', 'bar', { name: 'ALPHA', type: 'text' });
        const store = mockStore(testState);

        expect(() => {
          store.dispatch(createAction);
        }).toThrow(new Error('Variable with name "ALPHA" already exists'));
      });
    });

    describe('updateVariable()', () => {
      it('dispatches the UPDATE_VARIABLE action', () => {
        const store = mockStore(testState);

        store.dispatch(actionCreators.updateVariable(
          'node',
          'bar',
          'alpha',
          { fizz: 'buzz' },
        ));

        const actions = store.getActions();

        expect(actions[0]).toMatchObject({
          type: actionTypes.UPDATE_VARIABLE,
          meta: {
            entity: 'node',
            type: 'bar',
            variable: 'alpha',
          },
          configuration: { fizz: 'buzz' },
        });
      });

      it('throws an error if the variable does not already exist', () => {
        const createAction = actionCreators.updateVariable('node', 'bar', 'xenon', { name: 'XENON' });
        const store = mockStore(testState);

        expect(() => {
          store.dispatch(createAction);
        }).toThrow(new Error('Variable "xenon" does not exist'));
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
        ]);

        expect(sortByType(actions)).toEqual(expectedActions);
      });
    });
  });
});
