/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import IconOption from '../IconOption';

const mockProps = {
  label: 'add-a-person',
  input: {},
};

describe('<IconOption />', () => {
  it('can render', () => {
    const subject = shallow(<IconOption {...mockProps} />);
    expect(subject).toMatchSnapshot();
  });
});
