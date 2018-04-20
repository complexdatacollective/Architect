/* eslint-env jest */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { times, sample } from 'lodash';
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

  describe('addProtocolToDashboard()', () => {
    it('It adds the protocol to the protocols list', () => {
      const newState = reducer(
        undefined,
        actionCreators.addProtocolToDashboard(protocolPath),
      );

      expect(newState).toEqual([
        { path: protocolPath },
      ]);
    });

    it('It adds a max of 10 protocols to the protocols list', () => {
      const mockPaths = [
        'foo',
        'bar',
        'bazz',
        'buzz',
        'fizz',
      ];

      const protocolList = ['unique first protocol']
        .concat(times(15, () => sample(mockPaths)))
        .concat('unique last protocol');

      const newState = protocolList
        .map(item => actionCreators.addProtocolToDashboard(item))
        .reduce(
          (memo, action) =>
            reducer(
              memo,
              action,
            ),
          undefined,
        );

      expect(newState)
        .toEqual(
          protocolList
            .slice(-10)
            .map(item => ({ path: item })),
        );
    });
  });

  describe('removeProtocolFromDashboard()', () => {
    it('It adds the protocol to the protocols list', () => {
      const protocolList = ['foo', 'bar', 'bazz']
        .map(item => ({ path: item }));

      const newState = reducer(
        protocolList,
        actionCreators.removeProtocolFromDashboard('bar'),
      );

      expect(newState).toEqual(
        ['foo', 'bazz']
          .map(item => ({ path: item })),
      );
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
            actionCreators.addProtocolToDashboard('/foo/new-protocol'),
          );
          expect(dummyCallback.mock.calls[0]).toEqual(['/foo/new-protocol']);
        });
    });
  });

  describe('loadProtocol', () => {
    it('loads the protocol data and then dispatches setProtocol', () => {
      const store = createMockStore({});

      store.dispatch(actionCreators.loadProtocol('/bar/baz'));

      const actions = store.getActions();
      expect(loadProtocolData.mock.calls[0])
        .toEqual(['/bar/baz']);
      expect(actions[0]).toEqual(
        protocolActionCreators.setProtocol(
          { foo: 'bar test protocol' },
          '/bar/baz',
        ),
      );
    });
  });

  describe('chooseProtocol', () => {
    it('locates protocol, adds it to the dashboard, then runs callback', () => {
      const store = createMockStore({});
      const dummyCallback = jest.fn();

      return store.dispatch(actionCreators.chooseProtocol(dummyCallback))
        .then(() => {
          const actions = store.getActions();
          expect(locateProtocol.mock.calls.length).toBe(1);
          expect(actions[0]).toEqual(
            actionCreators.addProtocolToDashboard('/foo/located-protocol'),
          );
          expect(dummyCallback.mock.calls[0]).toEqual(['/foo/located-protocol']);
        });
    });
  });
});
