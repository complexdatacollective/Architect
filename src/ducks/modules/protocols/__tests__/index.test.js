/* eslint-env jest */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, { actionCreators } from '../index';
import { actionCreators as protocolActionCreators } from '../../protocol';
import { createProtocol, loadProtocolData, locateProtocol } from '../../../../other/protocols';

jest.mock('../../../../other/protocols');

const protocolPath = '/foo/bar';

const createMockStore = configureStore([thunk]);

describe('protocols  reducer', () => {
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

    it('It adds a max of 3 protocols to the protocols list', () => {
      const newState = [
        actionCreators.addProtocolToDashboard('foo'),
        actionCreators.addProtocolToDashboard('bar'),
        actionCreators.addProtocolToDashboard('bazz'),
        actionCreators.addProtocolToDashboard('buzz'),
        actionCreators.addProtocolToDashboard('fizz'),
      ].reduce((memo, action) =>
        reducer(
          memo,
          action,
        ),
        undefined,
      );

      expect(newState).toEqual([
        { path: 'bazz' },
        { path: 'buzz' },
        { path: 'fizz' },
      ]);
    });
  });

  describe('createProtocol()', () => {
    it('calls createProtocol and then adds it to the dashboard', () => {
      const store = createMockStore({});

      return store.dispatch(actionCreators.createProtocol())
        .then(() => {
          const actions = store.getActions();
          expect(createProtocol.mock.calls.length).toBe(1);
          expect(actions[0]).toMatchObject(
            actionCreators.addProtocolToDashboard('/foo/new-protocol'),
          );
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

  describe('locateAndLoadProtocol', () => {
    it('locates protocol and then loads it', () => {
      const store = createMockStore({});

      return store.dispatch(actionCreators.locateAndLoadProtocol())
        .then(() => {
          const actions = store.getActions();
          expect(locateProtocol.mock.calls.length).toBe(1);
          expect(actions[0]).toEqual(
            protocolActionCreators.setProtocol(
              { foo: 'bar test protocol' },
              '/foo/located-protocol',
            ),
          );
        });
    });
  });
});
