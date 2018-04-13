/* eslint-env jest */

import reducer, { actionCreators } from '../index';

describe('protocol root reducer', () => {
  describe('initial state', () => {
    it('has an initial state', () => {
      const initialState = reducer();
      expect(initialState).toEqual(
        {
          externalData: [],
          forms: {},
          stages: [],
          variableRegistry: {},
        },
      );
    });
  });

  describe('setProtocol()', () => {
    it('replaces the existing protocol', () => {
      const replacementProtocol = {
        externalData: [{ nodes: [{ foo: 'bar' }] }],
        forms: { fooForm: { bar: 'baz' } },
        stages: [{ type: 'foobar' }],
        variableRegistry: { fooVar: { baz: 'buzz' } },
      };

      const newState = reducer(
        undefined,
        actionCreators.setProtocol(replacementProtocol),
      );

      expect(newState).toEqual(
        {
          ...replacementProtocol,
        },
      );
    });
  });
});
