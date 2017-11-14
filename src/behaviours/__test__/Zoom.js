/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Zoom from '../Zoom';

const mockProps = {
};

describe('<ZoomElement />', () => {
  it('can render', () => {
    const component = shallow(<Zoom {...mockProps} >Foo</Zoom>);

    expect(component).toMatchSnapshot();
  });
});
