/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Cards } from '../Cards';

const mockProps = {
  location: {},
  goTo: () => {},
  goBack: () => {},
};

describe('<Cards />', () => {
  it('can render?', () => {
    const component = shallow(<Cards {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
