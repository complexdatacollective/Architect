/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Scene } from '../Scene';

const mockProps = {
  protocolMeta: {},
  location: {},
  handleClickStart: () => {},
};

describe('<Scene />', () => {
  it('can render', () => {
    const component = shallow(<Scene {...mockProps} />);

    expect(component.hasClass('scene--protocol')).toBe(false);
    expect(component).toMatchSnapshot();
  });

  it('shows protocol when there is one', () => {
    const props = { protocolMeta: { id: 'foo' } };
    const component = shallow(<Scene {...mockProps} {...props} />);

    expect(component.hasClass('scene--protocol')).toBe(true);
    expect(component).toMatchSnapshot();
  });
});
