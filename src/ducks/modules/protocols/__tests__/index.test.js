/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import { advanceTo } from 'jest-date-mock';
import thunk from 'redux-thunk';
import { isMatch } from 'lodash';
import history from '@app/history';
import reducer, { actionCreators } from '../index';
import { actionCreators as registerActionCreators } from '../register';
import testState from '../../../../__tests__/testState.json';
import { loadProtocolConfiguration } from '../../../../other/protocols';
import { APP_SCHEMA_VERSION } from '../../../../config';

jest.mock('../../../../other/protocols');
jest.mock('../../dialogs');
jest.mock('../../../../config');
jest.mock(
  '../../../../protocol-validation/migrations/migrations',
  () => ([
    { version: 1, migration: protocol => protocol },
    { version: 2, migration: protocol => protocol },
    { version: 3, migration: protocol => protocol },
    { version: 4, migration: protocol => protocol },
  ]),
  { virtual: true },
);

expect.extend({
  containsDialogAction(received, dialogMatcher) {
    const pass = received.some(
      ([action]) =>
        action.type === 'PROTOCOL/OPEN_DIALOG' && isMatch(action.dialog, dialogMatcher),
    );

    if (!pass) {
      return {
        message: () =>
          `expected ${JSON.stringify(received)} to contain dialog action matching ${JSON.stringify(dialogMatcher)}`,
        pass: false,
      };
    }

    return {
      message: () =>
        `expected ${JSON.stringify(received)} not to contain dialog action matching ${JSON.stringify(dialogMatcher)}`,
      pass: true,
    };
  },
});

expect.extend({
  containsAction(received, actionMatcher) {
    const pass = received.some(action => isMatch(action[0], actionMatcher));

    if (!pass) {
      return {
        message: () =>
          `expected ${JSON.stringify(received)} to contain action matching ${JSON.stringify(actionMatcher)}`,
        pass: false,
      };
    }

    return {
      message: () =>
        `expected ${JSON.stringify(received)} not to contain action matching ${JSON.stringify(actionMatcher)}`,
      pass: true,
    };
  },
});

const log = jest.fn();

const logger = () =>
  next =>
    (action) => {
      log(action);
      return next(action);
    };

const getStore = (initialState = testState) =>
  createStore(
    (state = initialState) => state,
    applyMiddleware(thunk, logger),
  );

const getProtocol = (mergeProps = {}) => ({
  ...testState.protocol.present,
  ...mergeProps,
});

describe('protocols', () => {
  let store;

  beforeEach(() => {
    log.mockClear();
    store = getStore();
  });

  describe('createAndLoadProtocol()', () => {
    it('triggers create and import actions', () =>
      store.dispatch(actionCreators.createAndLoadProtocol())
        .then(() => {
          expect(log.mock.calls[0]).toEqual([{ payload: 'PROTOCOLS', type: 'STATUS/BUSY' }]);
          expect(log.mock.calls[1]).toEqual([{ type: 'PROTOCOLS/CREATE_PROTOCOL' }]);
          expect(log.mock.calls[2]).toEqual([{
            filePath: '/dev/null/fake/user/entered/path',
            workingPath: '/dev/null/fake/working/path',
            type: 'PROTOCOLS/CREATE_PROTOCOL_SUCCESS',
          }]);
          expect(log.mock.calls[3]).toEqual([{
            advanced: true,
            filePath: '/dev/null/fake/user/entered/path',
            id: '809895df-bbd7-4c76-ac58-e6ada2625f9b',
            type: 'PROTOCOLS/REGISTER',
            workingPath: '/dev/null/fake/working/path',
          }]);

          expect(history.entries.pop()).toMatchObject({
            pathname: '/edit/809895df-bbd7-4c76-ac58-e6ada2625f9b/',
          });
        }),
    );
  });

  describe('saveAndBundleProtocol()', () => {
    advanceTo(Date.UTC(2017, 5, 27, 0, 0, 0));

    describe('invalid protocol', () => {
      beforeEach(() => {
        log.mockClear();
        store = getStore({
          ...testState,
          protocol: {
            present: getProtocol({ stages: [] }),
          },
        });
      });

      it('dispatches an error when protocol is invalid', () =>
        store.dispatch(actionCreators.saveAndBundleProtocol())
          .then(() => {
            expect(log.mock.calls).toMatchSnapshot();
          }),
      );
    });

    it('triggers save and export actions', () =>
      store.dispatch(actionCreators.saveAndBundleProtocol())
        .then(() => {
          expect(log.mock.calls).toMatchSnapshot();
        }),
    );
  });

  describe('unbundleAndLoadProtocol()', () => {
    beforeEach(() => {
      log.mockClear();
    });

    it('triggers import action and load redirect', done =>
      store.dispatch(actionCreators.unbundleAndLoadProtocol('/dev/null/mock/path'))
        .then(() => {
          expect(log.mock.calls).containsAction({ payload: 'PROTOCOLS', type: 'STATUS/BUSY' });
          expect(log.mock.calls).containsAction({ type: 'PROTOCOLS/UNBUNDLE_SUCCESS' });
          expect(log.mock.calls).containsAction({ type: 'PROTOCOLS/REGISTER' });
          expect(history.entries.pop()).toMatchObject({
            pathname: '/edit/809895df-bbd7-4c76-ac58-e6ada2625f9b/',
          });
          done();
        }),
    );

    it('when the protocol is invalid it dispatches an error when protocol is invalid (but still imports it)', () => {
      loadProtocolConfiguration.mockReturnValueOnce(
        Promise.resolve(getProtocol({ schemaVersion: APP_SCHEMA_VERSION, stages: [] })),
      );

      return store.dispatch(actionCreators.unbundleAndLoadProtocol('/dev/null/mock/path/invalid'))
        .then(() => {
          expect(log.mock.calls).containsDialogAction({ type: 'Error' });
          expect(log.mock.calls).toMatchSnapshot();
        });
    });

    it('when the schema version is greater than the app version it notifies user to upgrade the app', () => {
      const futureVersion = APP_SCHEMA_VERSION + 1;

      loadProtocolConfiguration.mockReturnValueOnce(
        Promise.resolve(getProtocol({ schemaVersion: futureVersion })),
      );

      return store.dispatch(actionCreators.unbundleAndLoadProtocol('/dev/null/mock/path/newer-protocol'))
        .then(() => {
          expect(log.mock.calls).toMatchSnapshot();
          expect(log.mock.calls).containsDialogAction({
            title: 'Protocol not compatible with current version',
            type: 'UserError',
          });
        });
    });

    it('when the schema version is less than the app version it attempts to upgrade protocol and then imports it', () => {
      const pastVersion = APP_SCHEMA_VERSION - 1;

      loadProtocolConfiguration.mockReturnValueOnce(
        Promise.resolve(getProtocol({ schemaVersion: pastVersion })),
      );

      return store.dispatch(actionCreators.unbundleAndLoadProtocol('/dev/null/mock/path/older-protocol'))
        .then(() => {
          expect(log.mock.calls).toMatchSnapshot();
          expect(log.mock.calls).containsDialogAction({ title: 'Upgrade to continue', type: 'Confirm' });
        });
    });

    it('when the schema version is the same as the app version it imports the protocol', () => {
      loadProtocolConfiguration.mockReturnValueOnce(
        Promise.resolve(getProtocol()),
      );

      return store.dispatch(actionCreators.unbundleAndLoadProtocol('/dev/null/mock/path/matching-protocol'))
        .then(() => {
          expect(log.mock.calls).toMatchSnapshot();
          expect(log.mock.calls).containsAction({ type: 'PROTOCOLS/UNBUNDLE_SUCCESS' });
        });
    });
  });

  describe('reducer', () => {
    let protocolStore;

    beforeEach(() => {
      protocolStore = createStore(reducer);
    });

    it('REGISTER_PROTOCOL', (done) => {
      protocolStore.subscribe(() => {
        const state = protocolStore.getState();

        expect(state[0]).toMatchObject(
          {
            filePath: '/dev/null/mock/file/path',
            advanced: true,
            id: '809895df-bbd7-4c76-ac58-e6ada2625f9b',
            workingPath: '/dev/null/mock/working/path',
          },
        );

        done();
      });

      protocolStore.dispatch(registerActionCreators.registerProtocol({
        filePath: '/dev/null/mock/file/path',
        workingPath: '/dev/null/mock/working/path',
      }));
    });
  });
});
