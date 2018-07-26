/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { createStore } from 'redux';
import Variables from '../Variables';

const mockStore = () =>
  createStore(() => {});

const mockProps = {
  store: mockStore(),
  form: 'foo',
  name: 'bar',
  itemComponent: () => null,
};

describe('<Variables />', () => {
  it('can render', () => {
    const subject = shallow(<Variables {...mockProps} />);
    expect(subject).toMatchSnapshot();
  });
});
