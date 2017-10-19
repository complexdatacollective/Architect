/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import ZoomElement from '../ZoomElement';

const mockProps = {
};

describe('<ZoomElement />', () => {
  it('can render', () => {
    const component = shallow(<ZoomElement {...mockProps} >Foo</ZoomElement>);

    expect(component).toMatchSnapshot();
  });
});
