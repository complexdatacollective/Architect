/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Screens from '../Screens';

const mockProps = {
  screens: [],
  closeScreen: () => {},
};

describe('<Screens />', () => {
  it('can render?', () => {
    const component = shallow(<Screens {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
