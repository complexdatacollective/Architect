/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import { advanceTo } from 'jest-date-mock';
import thunk from 'redux-thunk';
import reducer, { actionCreators } from '../index';
import { actionCreators as registerActionCreators } from '../register';
import history from '../../../../history';
import testState from '../../../../__tests__/testState.json';
import { loadProtocolConfiguration } from '../../../../other/protocols';

jest.mock('../../../../other/protocols');

const invalidProtocol = {
  ...testState.protocol.present,
  stages: [],
};

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
          expect(log.mock.calls[0]).toEqual([{ type: 'PROTOCOLS/CREATE_PROTOCOL' }]);
          expect(log.mock.calls[1]).toEqual([{
            filePath: '/dev/null/fake/user/entered/path',
            workingPath: '/dev/null/fake/working/path',
            type: 'PROTOCOLS/CREATE_PROTOCOL_SUCCESS',
          }]);
          expect(log.mock.calls[2]).toEqual([{
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

  describe('saveAndExportProtocol()', () => {
    advanceTo(new Date(2017, 5, 27, 0, 0, 0));

    describe('invalid protocol', () => {
      beforeEach(() => {
        log.mockClear();
        store = getStore({
          ...testState,
          protocol: {
            present: invalidProtocol,
          },
        });
      });

      it('throws an error when protocol is invalid', () =>
        store.dispatch(actionCreators.saveAndExportProtocol())
          .then(() => {
            expect(log.mock.calls[0]).toEqual([{ type: 'PROTOCOLS/SAVE' }]);
            expect(log.mock.calls[1][0]).toMatchObject({
              type: 'PROTOCOLS/SAVE_ERROR',
            });
          }),
      );
    });

    it('triggers save and export actions', () =>
      store.dispatch(actionCreators.saveAndExportProtocol())
        .then(() => expect(log.mock.calls).toMatchSnapshot()),
    );
  });

  describe('importAndLoadProtocol()', () => {
    it('triggers import action and load redirect', done =>
      store.dispatch(actionCreators.importAndLoadProtocol('/dev/null/mock/path'))
        .then(() => {
          expect(log.mock.calls).toMatchSnapshot();
          expect(history.entries.pop()).toMatchObject({
            pathname: '/edit/809895df-bbd7-4c76-ac58-e6ada2625f9b/',
          });
          done();
        }),
    );

    describe('invalid protocol', () => {
      beforeEach(() => {
        log.mockClear();
        loadProtocolConfiguration.mockReturnValueOnce(
          Promise.resolve(invalidProtocol),
        );
      });

      it('throws an error when protocol is invalid', () =>
        store.dispatch(actionCreators.importAndLoadProtocol('/dev/null/mock/path/invalid'))
          .then(() => {
            expect(log.mock.calls).toMatchSnapshot();
          }),
      );
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
