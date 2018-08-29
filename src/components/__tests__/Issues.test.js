/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Issues } from '../Issues';

const mockIssues = {
  foo: 'bar',
  baz: [
    {
      buzz: 'foo',
      beep: 'boop',
    },
  ],
};

const mockProps = {
  show: true,
  issues: {},
};

describe('<Issues />', () => {
  it('will render', () => {
    const component = shallow(<Issues {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders issues from object', () => {
    const component = shallow(<Issues show issues={mockIssues} />);
    expect(component.find('li.issues__issue').length).toBe(3);
  });
});
