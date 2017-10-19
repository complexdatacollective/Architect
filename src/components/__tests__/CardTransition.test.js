/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import CardTransition from '../CardTransition';

const mockProps = {
};

describe('<CardTransition />', () => {
  it('can render', () => {
    const component = shallow(<CardTransition {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
