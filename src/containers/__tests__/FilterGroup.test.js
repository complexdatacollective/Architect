/* eslint-disable */
/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import FilterGroup from '../FilterGroup';

const mockFilter = {
  join: '',
  rules: [],
};
const mockProps = {
};

const mockStore = () =>
  createStore(
    () => ({
      protocol: {
        present: {
          variableRegistry: {

          }
        }
      },
    }),
  );

const makeSubject = (props) =>
  shallow(<FilterGroup {...mockProps} {...props} />);

describe('<FilterGroup />', () => {
  it('can render', () => {
    const subject = makeSubject();
    expect(subject).toMatchSnapshot();
  });

  it('onChangeJoin(value)', () => {
    const onChange = jest.fn();
    const subject = makeSubject({ onChange });
    subject.instance().onChangeJoin('foo');
    expect(onChange.mock.calls[0]).toEqual([{ "join": "foo", "rules": [] }]);
  });

  it('onUpdateRule(value, id, option)', () => {
    const onChange = jest.fn();

    const subject = makeSubject({
      onChange,
      filter: {
        rules: [
          {id: 'foo', options: { baz: 'hello' }},
          {id: 'bar', options: { buzz: 'world' }},
        ],
      }
    });

    subject.instance().onUpdateRule('hi', 'foo', 'baz');

    expect(onChange.mock.calls[0]).toEqual([{
      "rules": [
        {id: 'foo', options: { baz: 'hi' }},
        {id: 'bar', options: { buzz: 'world' }},
      ]
    }]);
  });

  it('onMoveRule(oldIndex, newIndex)', () => {
    const onChange = jest.fn();

    const subject = makeSubject({
      onChange,
      filter: {
        rules: [
          { id: 'foo' },
          { id: 'bar' },
          { id: 'baz' },
          { id: 'buzz' },
        ],
      }
    });

    subject.instance().onMoveRule({ oldIndex: 2, newIndex: 1 });

    expect(onChange.mock.calls[0]).toEqual([{
      "rules": [
        { id: 'foo' },
        { id: 'baz' },
        { id: 'bar' },
        { id: 'buzz' },
      ]
    }]);
  });

  it('onAddRule(type)', () => {
    const onChange = jest.fn();

    const subject = makeSubject({
      onChange,
      filter: {
        rules: [
        ],
      }
    });

    subject.instance().onAddRule('foo');

    expect(
      onChange.mock.calls[0][0].rules[0],
    ).toMatchObject(
      expect.objectContaining({
        type: 'foo',
        id: expect.anything(),
      }),
    );
  });

  it('onDeteRule(id)', () => {
    const onChange = jest.fn();

    const subject = makeSubject({
      onChange,
      filter: {
        rules: [
          { id: 'foo' },
          { id: 'bar' },
        ],
      }
    });

    subject.instance().onDeleteRule('foo');

    expect(
      onChange.mock.calls[0],
    ).toEqual([{ rules: [{ id: 'bar' }] }]);
  });

});
