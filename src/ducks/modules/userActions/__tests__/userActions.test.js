/* eslint-env jest */

import { getHasUnsavedChanges } from '@selectors/session';
import { actionCreators as dialogsActions } from '@modules/dialogs';
import {
  openDialog,
} from '@app/utils/dialogs';
import {
  checkSchemaVersion,
  validateNetcanvas,
} from '@app/utils/netcanvasFile';

import { actionCreators as sessionActions } from '@modules/session';
import { actionCreators, actionLocks } from '../userActions';

const { schemaVersionStates } = jest.requireActual('@app/utils/netcanvasFile');

jest.mock('@app/utils/dialogs');
jest.mock('@modules/dialogs');
jest.mock('@modules/session');
jest.mock('@selectors/session');
jest.mock('@app/utils/netcanvasFile');

const getState = jest.fn(() => ({
  ui: {
    status: { busy: [] },
    screens: {},
  },
}));

const dispatch = jest.fn((arg) => {
  if (typeof arg === 'function') {
    return arg(dispatch, getState);
  }
  return arg;
});

describe('userActions', () => {
  it('exports actionLocks', () => {
    expect(actionLocks).toEqual(
      expect.objectContaining({
        loading: expect.any(Function),
        protocols: expect.any(Function),
        saving: expect.any(Function),
      }),
    );
  });

  describe('actions', () => {
    it('openNetcanvas', () => {
      getHasUnsavedChanges.mockResolvedValueOnce(false);
      checkSchemaVersion.mockResolvedValueOnce(['X', schemaVersionStates.OK]);
      validateNetcanvas.mockResolvedValueOnce(true);
      sessionActions.openNetcanvas.mockResolvedValueOnce(true);
      dispatch(actionCreators.openNetcanvas());
      console.log(dispatch.mock.calls);
      expect(dispatch.mock.calls).toBe(null);
    });
    it.todo('createNetcanvas');
    it.todo('saveAsNetcanvas');
    it.todo('saveNetcanvas');
  });
});
