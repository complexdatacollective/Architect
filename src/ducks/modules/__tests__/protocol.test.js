/* eslint-env jest */

import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { actionCreators as actions, actionTypes as types } from '../protocol';
import { rootEpic } from '../root';
import exporter from '../../../utils/exporter';

const middlewares = [createEpicMiddleware(rootEpic)];
const mockStore = configureMockStore(middlewares);

jest.mock(
  '../../../utils/exporter',
  () => jest.fn(
    () => new Promise(resolve => resolve()),
  ),
);

describe('async actions', () => {
  it('calls exporter() and EXPORT_COMPLETE when done', (done) => {
    const expectedActions = [
      { type: types.EXPORT_PROTOCOL },
      { type: types.EXPORT_COMPLETE },
    ];

    const store = mockStore({
      protocol: {
        present: {
          foo: 'bar',
        },
      },
    });

    store.dispatch(actions.exportProtocol());
    expect(exporter.mock.calls).toEqual([[{ foo: 'bar' }]]);

    // TODO: nextTick
    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, 1);
  });
});
