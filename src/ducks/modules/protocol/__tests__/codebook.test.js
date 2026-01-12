/* eslint-env jest */
import { vi, describe, it, expect } from 'vitest';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { set } from 'lodash';
import { getThunkMocks } from '@app/__tests__/testHelpers';
import { test as stageActions } from '../stages';
import reducer, { actionTypes, actionCreators, test } from '../codebook';
import testState from '../../../../__tests__/testState.json';

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
        test.createType('node', 'foo', { bar: 'bazz' }),
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
        test.updateType('node', 'foo', { fizz: 'pop' }),
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
        test.deleteType('node', 'foo'),
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
          test.createVariable('node', 'foo', 'bar', { baz: 'buzz' }),
        );

        expect(result).toEqual({
          edge: {},
          node: {
            foo: {
              variables: {
                bar: {
                  baz: 'buzz',
                },
              },
            },
          },
        });
      });

      it('CREATE_VARIABLE for ego entity', () => {
        const result = reducer(
          {
            ego: { variables: {} },
          },
          test.createVariable('ego', undefined, 'bar', { baz: 'buzz' }),
        );

        expect(result).toEqual({
          ego: {
            variables: {
              bar: {
                baz: 'buzz',
              },
            },
          },
        });
      });
    });

    describe('UPDATE_VARIABLE', () => {
      it('UPDATE_VARIABLE for node entity', () => {
        const result = reducer(
          {
            node: { foo: { variables: { bar: { name: 'a', type: 'string', baz: 'buzz' } } } },
            edge: {},
            ego: {},
          },
          test.updateVariable('bar', { fizz: 'pop' }, false),
        );

        expect(result).toEqual({
          edge: {},
          ego: {},
          node: {
            foo: {
              variables: {
                bar: {
                  fizz: 'pop',
                },
              },
            },
          },
        });
      });

      it('UPDATE_VARIABLE for ego entity', () => {
        const result = reducer(
          {
            ego: { variables: { bar: { name: 'a', type: 'string', baz: 'buzz' } } },
          },
          test.updateVariable('bar', { fizz: 'pop' }),
        );

        expect(result).toEqual({
          ego: {
            variables: {
              bar: {
                fizz: 'pop',
              },
            },
          },
        });
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
        test.deleteVariable('node', 'foo', 'bar'),
      );

      expect(result).toEqual({
        node: { foo: { variables: {} } },
        edge: {},
      });
    });

    it('DELETE_VARIABLE for ego entity', () => {
      const result = reducer(
        {
          ego: { variables: { bar: { baz: 'buzz' } } },
          edge: {},
        },
        test.deleteVariable('ego', undefined, 'bar'),
      );

      expect(result).toEqual({
        ego: { variables: {} },
        edge: {},
      });
    });
  });

  describe('async actions', () => {
    describe('createType()', () => {
      it('dispatches the CREATE_TYPE action with a type id', async () => {
        const [dispatch, getState] = getThunkMocks(testState);

        await actionCreators.createType(
          'node',
          { fizz: 'buzz' },
        )(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          {
            type: actionTypes.CREATE_TYPE,
            meta: {
              entity: 'node',
              type: expect.any(String),
            },
            configuration: {
              color: '',
              variables: {},
              fizz: 'buzz',
            },
          },
        );

        expect(dispatch).toHaveBeenNthCalledWith(
          4,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
      });
    });

    describe('updateType()', () => {
      it('dispatches the UPDATE_TYPE action', async () => {
        const [dispatch, getState] = getThunkMocks(testState);

        await actionCreators.updateType(
          'node',
          'person',
          { fizz: 'buzz' },
        )(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          {
            type: actionTypes.UPDATE_TYPE,
            meta: {
              entity: 'node',
              type: 'person',
            },
            configuration: {
              fizz: 'buzz',
            },
          },
        );

        expect(dispatch).toHaveBeenNthCalledWith(
          4,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
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

      it('dispatches the CREATE_VARIABLE action with a variable id for node', async () => {
        const [dispatch, getState] = getThunkMocks(testState);

        await actionCreators.createVariable(
          'node',
          'foo',
          { fizz: 'buzz', name: 'bar', type: 'text' },
        )(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          {
            type: actionTypes.CREATE_VARIABLE,
            meta: {
              entity: 'node',
              type: 'foo',
              variable: expect.any(String),
            },
            configuration: {
              fizz: 'buzz',
              name: 'bar',
              type: 'text',
            },
          },
        );

        expect(dispatch).toHaveBeenNthCalledWith(
          4,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
      });

      it('dispatches the CREATE_VARIABLE action with a variable id for ego', async () => {
        const [dispatch, getState] = getThunkMocks(testState);

        await actionCreators.createVariable(
          'ego',
          null,
          { fizz: 'buzz', name: 'bar', type: 'text' },
        )(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          {
            type: actionTypes.CREATE_VARIABLE,
            meta: {
              entity: 'ego',
              variable: expect.any(String),
            },
            configuration: {
              fizz: 'buzz',
              name: 'bar',
              type: 'text',
            },
          },
        );

        expect(dispatch).toHaveBeenNthCalledWith(
          4,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
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
      it('dispatches the UPDATE_VARIABLE action', async () => {
        const [dispatch, getState] = getThunkMocks(testState);

        await actionCreators.updateVariable(
          'node',
          'bar',
          'alpha',
          { fizz: 'buzz' },
        )(dispatch, getState);

        expect(dispatch).toHaveBeenCalledWith({
          type: actionTypes.UPDATE_VARIABLE,
          meta: {
            variable: 'alpha',
          },
          merge: false,
          configuration: { fizz: 'buzz' },
        });

        expect(dispatch).toHaveBeenNthCalledWith(
          4,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
      });

      it('throws an error if the variable does not already exist', () => {
        const createAction = actionCreators.updateVariable('node', 'bar', 'xenon', { name: 'XENON' });
        const store = mockStore(testState);

        expect(() => {
          store.dispatch(createAction);
        }).toThrow(new Error('Variable "xenon" does not exist'));
      });
    });

    describe('updateVariableByUUID()', () => {
      it('dispatches the UPDATE_VARIABLE action', async () => {
        const [dispatch, getState] = getThunkMocks(testState);

        await actionCreators.updateVariableByUUID(
          'alpha',
          { fizz: 'buzz' },
        )(dispatch, getState);

        expect(dispatch).toHaveBeenCalledWith({
          type: actionTypes.UPDATE_VARIABLE,
          meta: {
            variable: 'alpha',
          },
          merge: false,
          configuration: { fizz: 'buzz' },
        });

        expect(dispatch).toHaveBeenNthCalledWith(
          4,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
      });
    });

    describe('deleteType()', () => {
      it('Dispatches delete actions for all related objects', async () => {
        const mockStateWithProtocol = { ...testState };
        set(
          mockStateWithProtocol,
          'protocol.present.stages',
          [
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
        );

        const [dispatch, getState] = getThunkMocks(mockStateWithProtocol);

        await actionCreators.deleteType('node', 'foo', true)(dispatch, getState);

        expect(dispatch).toHaveBeenCalledWith(test.deleteType('node', 'foo'));
        expect(dispatch).toHaveBeenNthCalledWith(4, stageActions.deleteStage('bazz'));
        expect(dispatch).toHaveBeenNthCalledWith(
          7,
          stageActions.deletePrompt('buzz', 'fizz', true),
        );

        expect(dispatch).toHaveBeenNthCalledWith(
          10,
          {
            type: 'SESSION/PROTOCOL_CHANGED',
            protocolIsValid: true,
            ipc: true,
          },
        );
      });
    });
  });
});
