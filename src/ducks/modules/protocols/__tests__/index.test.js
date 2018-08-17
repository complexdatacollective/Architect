/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer, { actionCreators } from '../index';
import { actionCreators as importActionCreators } from '../import';
import history from '../../../../history';

jest.mock('../../../../other/protocols');

const initalState = {
  protocols: [
    {
      id: '32beec15',
      filePath: '',
      workingPath: '',
    },
  ],
  protocol: {
    present: {
      name: 'mock protocol',
    },
  },
  session: { activeProtocol: '32beec15' },
};

const log = jest.fn();

const logger = () =>
  next =>
    (action) => {
      log(action);
      return next(action);
    };

const getStore = () =>
  createStore(
    (state = initalState) => state,
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
          expect(log.mock.calls[1]).toEqual([{ filePath: '/dev/null/fake/user/entered/path', type: 'PROTOCOLS/CREATE_PROTOCOL_SUCCESS' }]);
          expect(log.mock.calls[2]).toEqual([{ filePath: '/dev/null/fake/user/entered/path', type: 'PROTOCOLS/IMPORT' }]);
          expect(log.mock.calls[3]).toEqual([{ advanced: true, filePath: '/dev/null/fake/user/entered/path', id: '809895df-bbd7-4c76-ac58-e6ada2625f9b', type: 'PROTOCOLS/IMPORT_SUCCESS', workingPath: '/dev/null/fake/working/path' }]);
          expect(history.entries.pop()).toMatchObject({ pathname: '/edit/809895df-bbd7-4c76-ac58-e6ada2625f9b/' });
        }),
    );
  });

  describe('saveAndExportProtocol()', () => {
    it('triggers save and export actions', () =>
      store.dispatch(actionCreators.saveAndExportProtocol())
        .then(() => {
          expect(log.mock.calls[0]).toEqual([{ type: 'PROTOCOLS/SAVE' }]);
          expect(log.mock.calls[1]).toEqual([{ destinationPath: '/dev/null/fake/user/protocol/path', protocol: { name: 'mock protocol' }, type: 'PROTOCOLS/SAVE_SUCCESS' }]);
          expect(log.mock.calls[2]).toEqual([{ type: 'PROTOCOLS/EXPORT' }]);
          expect(log.mock.calls[3]).toEqual([{ filePath: '', type: 'PROTOCOLS/EXPORT_SUCCESS' }]);
        }),
    );
  });

  describe('importAndLoadProtocol()', () => {
    it('triggers import action and load redirect', () =>
      store.dispatch(actionCreators.importAndLoadProtocol('/dev/null/mock/path'))
        .then(() => {
          expect(log.mock.calls[0]).toEqual([{ filePath: '/dev/null/mock/path', type: 'PROTOCOLS/IMPORT' }]);
          expect(log.mock.calls[1]).toEqual([{ advanced: true, filePath: '/dev/null/mock/path', id: '809895df-bbd7-4c76-ac58-e6ada2625f9b', type: 'PROTOCOLS/IMPORT_SUCCESS', workingPath: '/dev/null/fake/working/path' }]);
          expect(history.entries.pop()).toMatchObject({ pathname: '/edit/809895df-bbd7-4c76-ac58-e6ada2625f9b/' });
        }),
    );
  });

  describe('openProtocol()', () => {
    it('triggers import action and load redirect', () =>
      store.dispatch(actionCreators.openProtocol())
        .then(() => {
          expect(log.mock.calls[0]).toEqual([{ filePath: '/dev/null/fake/explore/path', type: 'PROTOCOLS/IMPORT' }]);
          expect(log.mock.calls[1]).toEqual([{ advanced: true, filePath: '/dev/null/fake/explore/path', id: '809895df-bbd7-4c76-ac58-e6ada2625f9b', type: 'PROTOCOLS/IMPORT_SUCCESS', workingPath: '/dev/null/fake/working/path' }]);
          expect(history.entries.pop()).toMatchObject({ pathname: '/edit/809895df-bbd7-4c76-ac58-e6ada2625f9b/' });
        }),
    );
  });

  describe('reducer', () => {
    let protocolStore;

    beforeEach(() => {
      protocolStore = createStore(reducer);
    });

    it('IMPORT_PROTOCOL_SUCCESS', (done) => {
      protocolStore.subscribe(() => {
        const state = protocolStore.getState();

        expect(state).toEqual([
          {
            filePath: '/dev/null/mock/file/path',
            id: '5df-bbd7',
            advanced: false,
            workingPath: '/dev/null/mock/working/path',
          },
        ]);

        done();
      });

      protocolStore.dispatch(importActionCreators.importProtocolSuccess({
        filePath: '/dev/null/mock/file/path',
        id: '5df-bbd7',
        advanced: false,
        workingPath: '/dev/null/mock/working/path',
      }));
    });
  });
});
