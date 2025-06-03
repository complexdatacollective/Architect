/* eslint-env jest */

import { getThunkMocks } from '@app/__tests__/helpers';
import reducer, { actionCreators, test } from '../index';

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
        test.updateOptions({
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

  describe('thunks', () => {
    it('PROTOCOL/UPDATE_OPTIONS', async () => {
      const [dispatch] = getThunkMocks();

      await actionCreators.updateOptions({
        name: 'bar',
      })(dispatch);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        {
          options: {
            name: 'bar',
          },
          type: 'PROTOCOL/UPDATE_OPTIONS',
        },
      );

      expect(dispatch).toHaveBeenNthCalledWith(
        3,
        {
          type: 'SESSION/PROTOCOL_CHANGED',
          ipc: true,
          protocolIsValid: true,
        },
      );
    });
  });
});
