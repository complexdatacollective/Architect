/* eslint-env jest */

import reducer, { actionCreators } from '../index';

describe('protocol', () => {
  describe('reducer', () => {
    it('initial state', () => {
      const initialState = reducer();
      expect(initialState).toEqual(
        {
          assetManifest: {},
          stages: [],
          codebook: {
            node: {},
            edge: {},
          },
        },
      );
    });

    it('PROTOCOL/UPDATE_OPTIONS', () => {
      const currentProtocol = {
        name: 'foo',
        assetManifest: { nodes: [{ foo: 'bar' }] },
        forms: { fooForm: { bar: 'baz' } },
        stages: [{ type: 'foobar' }],
        codebook: { fooVar: { baz: 'buzz' } },
      };

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
          codebook: { fooVar: { baz: 'buzz' } },
        });
    });

    it('SESSION/OPEN_NETCANVAS_SUCCESS', () => {
      const currentProtocol = {
        name: 'foo',
        assetManifest: { nodes: [] },
        forms: {},
        stages: [],
        codebook: {},
      };

      const newProtocol = {
        name: 'bar',
        assetManifest: { nodes: [{ foo: 'bar' }] },
        forms: { fooForm: { bar: 'baz' } },
        stages: [{ type: 'foobar' }],
        codebook: { fooVar: { baz: 'buzz' } },
      };

      const newStateFromFileAction = reducer(
        currentProtocol,
        {
          type: 'SESSION/OPEN_NETCANVAS_SUCCESS',
          payload: { protocol: newProtocol },
        },
      );

      expect(newStateFromFileAction)
        .toEqual({
          name: 'bar',
          assetManifest: { nodes: [{ foo: 'bar' }] },
          forms: { fooForm: { bar: 'baz' } },
          stages: [{ type: 'foobar' }],
          codebook: { fooVar: { baz: 'buzz' } },
        });
    });
  });
});
