/* eslint-disable */
/* eslint-env jest */

import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { actionCreators, actionTypes } from '../file';
import { saveProtocol, exportProtocol } from '../../../../other/protocols';

jest.mock('../../../../other/protocols');

const protocolPath = '/foo/bar';

const mockProtocol = {
  foo: 'bar',
};

const mockState = {
  protocol: {
    present: {
      ...mockProtocol,
    },
  },
  session: {
    activeProtocol: protocolPath,
  },
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
    state => state,
    mockState,
    applyMiddleware(thunk, logger),
  );

describe('protocol/file', () => {
  describe('saveProtocol()', () => {
    beforeEach(() => {
      log.mockClear();
      saveProtocol.mockClear();
    });

    it('calls saveProtocol and fires complete action', (done) => {
      const store = getStore();

      store.subscribe(() => {
        expect(saveProtocol.mock.calls).toEqual([[protocolPath, mockProtocol]]);
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.SAVE_COMPLETE);
        done();
      });

      store.dispatch(actionCreators.saveProtocol());
    });

  });

  describe('exportProtocol()', () => {
    beforeEach(() => {
      log.mockClear();
      saveProtocol.mockClear();
      exportProtocol.mockClear();
    });

    it('calls exportProtocol and fires complete action', (done) => {
      const store = getStore();
      let count = 0;

      store.subscribe(() => {
        count += 1;
        if (count < 2) { return; }

        expect(saveProtocol.mock.calls).toEqual([[protocolPath, mockProtocol]]);
        expect(log.mock.calls[0][0].type).toEqual(actionTypes.SAVE_COMPLETE);
        expect(exportProtocol.mock.calls).toEqual([[protocolPath]]);
        expect(log.mock.calls[1][0].type).toEqual(actionTypes.EXPORT_COMPLETE);
        done();
      });

      store.dispatch(actionCreators.exportProtocol());
    });

  });
});
