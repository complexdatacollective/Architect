/* eslint-env jest */

import reducer, { actionCreators } from '../index';

describe('protocol root reducer', () => {
  describe('initial state', () => {
    it('has an initial state', () => {
      const initialState = reducer();
      expect(initialState).toEqual(
        {
          assetManifest: {},
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

  describe('updateOptions()', () => {
    const currentProtocol = {
      name: 'foo',
      assetManifest: { nodes: [{ foo: 'bar' }] },
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
          assetManifest: { nodes: [{ foo: 'bar' }] },
          forms: { fooForm: { bar: 'baz' } },
          stages: [{ type: 'foobar' }],
          variableRegistry: { fooVar: { baz: 'buzz' } },
        });
    });
  });
});
