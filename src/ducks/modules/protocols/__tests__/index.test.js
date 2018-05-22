/* eslint-env jest */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { times, sampleSize } from 'lodash';
import reducer, { actionCreators } from '../index';
import { createProtocol, locateProtocol } from '../../../../other/protocols';
import { protocolLoadedAction } from '../../protocol/file';
import history from '../../../../history';

jest.mock('../../../../other/protocols');
jest.mock('../../../../history');

const protocolPath = '/foo/bar';

const createMockStore = configureStore([thunk]);

describe('protocols reducer', () => {
  describe('initial state', () => {
    it('has an initial state', () => {
      const initialState = reducer();
      expect(initialState).toEqual([]);
    });
  });

  describe('file.PROTOCOL_LOADED', () => {
    it('It adds the protocol to the protocols list', () => {
      const newState = reducer(
        undefined,
        protocolLoadedAction({ archivePath: protocolPath }),
      );

      expect(newState[0]).toMatchObject(
        { archivePath: protocolPath },
      );
    });

    it("It doesn't add duplicate protocols to the list", () => {
      const newState = times(
        3,
        () => protocolLoadedAction({ archivePath: protocolPath }),
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
        .map(item => protocolLoadedAction(item))
        .reduce(
          (memo, action) =>
            reducer(
              memo,
              action,
            ),
          undefined,
        );

      expect(newState.length).toEqual(10);
      expect(newState).toEqual(protocolList.slice(-10).reverse());
    });
  });

  beforeEach(() => {
    history.push.mockClear();
  });

  describe('createProtocol()', () => {
    it('calls createProtocol, adds it to the dashboard, then runs callback', () => {
      const store = createMockStore({});

      return store.dispatch(actionCreators.createProtocol())
        .then(() => {
          const actions = store.getActions();
          expect(createProtocol.mock.calls.length).toBe(1);
          expect(actions).toEqual([]);
          expect(history.push.mock.calls).toEqual([
            ['/edit/%2Ftmp%2Ffoo%2Fnew-protocol'],
          ]);
        });
    });
  });

  describe('chooseProtocol', () => {
    it('locates protocol, adds it to the dashboard, then runs callback', () => {
      const store = createMockStore({
        protocols: [],
      });

      return store.dispatch(actionCreators.chooseProtocol())
        .then(() => {
          const actions = store.getActions();
          expect(locateProtocol.mock.calls.length).toBe(1);
          expect(actions).toEqual([]);
          expect(history.push.mock.calls).toEqual([
            ['/edit/%2Ffoo%2Flocated-protocol'],
          ]);
        });
    });
  });
});
