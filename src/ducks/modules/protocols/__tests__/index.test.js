/* eslint-env jest */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { times, sampleSize, pick, omit } from 'lodash';
import reducer, { actionCreators } from '../index';
import { actionCreators as protocolActionCreators } from '../../protocol';
import { createProtocol, loadProtocolData, locateProtocol } from '../../../../other/protocols';

jest.mock('../../../../other/protocols');

const protocolPath = '/foo/bar';

const createMockStore = configureStore([thunk]);

describe('protocols reducer', () => {
  describe('initial state', () => {
    it('has an initial state', () => {
      const initialState = reducer();
      expect(initialState).toEqual([]);
    });
  });

  describe('addProtocol()', () => {
    it('It adds the protocol to the protocols list', () => {
      const newState = reducer(
        undefined,
        actionCreators.addProtocol({ archivePath: protocolPath }),
      );

      expect(newState[0]).toMatchObject(
        { archivePath: protocolPath },
      );
    });

    it("It doesn't add duplicate protocols to the list", () => {
      const newState = times(
        3,
        () => actionCreators.addProtocol({ archivePath: protocolPath }),
      )
        .reduce(
          (memo, action) =>
            reducer(
              memo,
              action,
            ),
          undefined,
        );

      expect(newState.length).toEqual(1);
      expect(newState[0]).toMatchObject(
        { archivePath: protocolPath },
      );
    });

    it('It adds a max of 10 protocols to the protocols list', () => {
      const mockPaths = [
        'foo',
        'bar',
        'bazz',
        'buzz',
        'fizz',
        'foobar',
        'barbar',
        'bazzbar',
        'buzzbar',
        'fizzbar',
        'foofizz',
        'barfizz',
        'bazzfizz',
        'buzzfizz',
        'fizzfizz',
      ];

      const protocolList = ['unique first protocol']
        .concat(sampleSize(mockPaths, 12))
        .concat('unique last protocol')
        .map(item => ({ archivePath: item }));

      const newState = protocolList
        .map(item => actionCreators.addProtocol(item))
        .reduce(
          (memo, action) =>
            reducer(
              memo,
              action,
            ),
          undefined,
        );

      expect(newState.length).toEqual(10);

      newState.forEach((item, index) => {
        expect(item)
          .toMatchObject(protocolList.slice(-10)[index]);
      });
    });
  });

  describe('createProtocol()', () => {
    it('calls createProtocol, adds it to the dashboard, then runs callback', () => {
      const store = createMockStore({});
      const dummyCallback = jest.fn();

      return store.dispatch(actionCreators.createProtocol(dummyCallback))
        .then(() => {
          const actions = store.getActions();
          expect(createProtocol.mock.calls.length).toBe(1);
          expect(actions[0]).toMatchObject(
            pick(
              actionCreators.addProtocol({ archivePath: '/foo/new-protocol' }),
              ['archivePath', 'type'],
            ),
          );
          expect(dummyCallback.mock.calls[0][0]).toMatchObject({
            archivePath: '/foo/new-protocol',
          });
        });
    });
  });

  describe('loadProtocol', () => {
    it('loads the protocol data and then dispatches setProtocol', () => {
      const store = createMockStore({ protocols: [{ id: 'foo', archivePath: '/bar/baz' }] });

      return store.dispatch(actionCreators.loadProtocol('foo'))
        .then(() => {
          expect(loadProtocolData.mock.calls[0])
            .toEqual(['/tmp/foo/bar']);

          const actions = store.getActions();

          expect(actions[0]).toEqual(
            actionCreators.updateProtocol(
              'foo',
              { id: 'foo', archivePath: '/bar/baz', workingPath: '/tmp/foo/bar' },
            ),
          );

          expect(actions[1]).toMatchObject(
            protocolActionCreators.setProtocol(
              { foo: 'bar test protocol' },
              { id: 'foo', archivePath: '/bar/baz' },
            ),
          );
        });
    });
  });

  describe('chooseProtocol', () => {
    it('locates protocol, adds it to the dashboard, then runs callback', () => {
      const store = createMockStore({
        protocols: [],
      });
      const dummyCallback = jest.fn();

      return store.dispatch(actionCreators.chooseProtocol(dummyCallback))
        .then(() => {
          const actions = store.getActions();

          const expectedAction = omit(actionCreators.addProtocol({ archivePath: '/foo/located-protocol' }), ['protocol.id']);

          expect(locateProtocol.mock.calls.length).toBe(1);
          expect(actions[0]).toMatchObject(expectedAction);
          expect(dummyCallback.mock.calls[0][0]).toMatchObject({
            archivePath: '/foo/located-protocol',
          });
        });
    });
  });
});
