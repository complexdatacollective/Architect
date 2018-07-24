/* eslint-env jest */

import reducer, { actionCreators } from '../index';
import { openProtocolAction } from '../file';

describe('protocol root reducer', () => {
  describe('initial state', () => {
    it('has an initial state', () => {
      const initialState = reducer();
      expect(initialState).toEqual(
        {
          externalData: {},
          forms: {},
          stages: [],
          variableRegistry: {
            node: {},
            edge: {},
          },
        },
      );
    });
  });

  describe('resetProtocol()', () => {
    const currentProtocol = {
      externalData: { nodes: [{ foo: 'bar' }] },
      forms: { fooForm: { bar: 'baz' } },
      stages: [{ type: 'foobar' }],
      variableRegistry: { fooVar: { baz: 'buzz' } },
    };

    it('resets the existing protocol', () => {
      const newStateFromFileAction = reducer(
        currentProtocol,
        actionCreators.resetProtocol(),
      );

      expect(newStateFromFileAction)
        .toEqual({
          externalData: {},
          forms: {},
          stages: [],
          variableRegistry: {
            node: {},
            edge: {},
          },
        });
    });
  });

  describe('updateOptions()', () => {
    const currentProtocol = {
      name: 'foo',
      externalData: { nodes: [{ foo: 'bar' }] },
      forms: { fooForm: { bar: 'baz' } },
      stages: [{ type: 'foobar' }],
      variableRegistry: { fooVar: { baz: 'buzz' } },
    };

    it('updates any top level properties', () => {
      const newStateFromFileAction = reducer(
        currentProtocol,
        actionCreators.updateOptions({
          name: 'bar',
        }),
      );

      expect(newStateFromFileAction)
        .toEqual({
          name: 'bar',
          externalData: { nodes: [{ foo: 'bar' }] },
          forms: { fooForm: { bar: 'baz' } },
          stages: [{ type: 'foobar' }],
          variableRegistry: { fooVar: { baz: 'buzz' } },
        });
    });
  });

  describe('file.openProtocol()', () => {
    const replacementProtocol = {
      externalData: { nodes: [{ foo: 'bar' }] },
      forms: { fooForm: { bar: 'baz' } },
      stages: [{ type: 'foobar' }],
      variableRegistry: { fooVar: { baz: 'buzz' } },
    };

    it('replaces the existing protocol', () => {
      const newStateFromFileAction = reducer(
        undefined,
        openProtocolAction(replacementProtocol),
      );

      expect(newStateFromFileAction)
        .toEqual(replacementProtocol);
    });
  });
});
