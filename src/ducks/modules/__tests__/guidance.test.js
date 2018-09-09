/* eslint-env jest */

import { flow } from 'lodash';
import reducer, { actionCreators } from '../guidance';

describe('guidance reducer', () => {
  it('has an initial state', () => {
    expect(reducer(undefined))
      .toEqual({
        history: [],
        id: null,
      });
  });

  describe('setGuidance', () => {
    it('records guidance with setGuidance', () => {
      expect(reducer(undefined, actionCreators.setGuidance('foo', 'bar')))
        .toEqual({
          history: [{
            name: 'bar',
            id: 'foo',
          }],
          id: 'foo',
        });
    });

    it('each successive call is added to history', () => {
      const result = flow(
        state => reducer(state, actionCreators.setGuidance('foo', 'bar')),
        state => reducer(state, actionCreators.setGuidance('bazz', 'buzz')),
      )(undefined);

      expect(result)
        .toEqual({
          history: [
            { id: 'foo', name: 'bar' },
            { id: 'bazz', name: 'buzz' },
          ],
          id: 'bazz',
        });
    });
  });

  describe('unsetGuidance', () => {
    it('it removes item from history and sets id to the last item in history', () => {
      const result = flow(
        state => reducer(state, actionCreators.setGuidance('foo', 'bar')),
        state => reducer(state, actionCreators.setGuidance('bazz', 'buzz')),
        state => reducer(state, actionCreators.unsetGuidance('buzz')),
      )(undefined);

      expect(result)
        .toEqual({
          history: [
            { id: 'foo', name: 'bar' },
          ],
          id: 'foo',
        });
    });

    it('it will remove intermediate history without changing id', () => {
      const result = flow(
        state => reducer(state, actionCreators.setGuidance('foo', 'bar')),
        state => reducer(state, actionCreators.setGuidance('bazz', 'buzz')),
        state => reducer(state, actionCreators.setGuidance('fizz', 'pop')),
        state => reducer(state, actionCreators.unsetGuidance('buzz')),
      )(undefined);

      expect(result)
        .toEqual({
          history: [
            { id: 'foo', name: 'bar' },
            { id: 'fizz', name: 'pop' },
          ],
          id: 'fizz',
        });
    });

    it('it will remove last item and reset id to null', () => {
      const result = flow(
        state => reducer(state, actionCreators.setGuidance('foo', 'bar')),
        state => reducer(state, actionCreators.unsetGuidance('bar')),
      )(undefined);

      expect(result)
        .toEqual({
          history: [],
          id: null,
        });
    });
  });
});
