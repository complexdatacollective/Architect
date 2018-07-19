/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { createStore } from 'redux';
import Variable from '../Variable';

const mockStore = () =>
  createStore(() => {});

const mockProps = {
  store: mockStore(),
  form: 'foo',
  fieldId: 'bar',
};

describe('<Variable />', () => {
  it('can render', () => {
    const subject = shallow(<Variable {...mockProps} />);
    expect(subject).toMatchSnapshot();
  });
});
