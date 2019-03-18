/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Overview } from '../Overview';

const mockProps = {
  name: '',
  forms: {},
  codebook: {},
  flipId: 'foo',
};

describe('<Overview />', () => {
  it('can render?', () => {
    const component = shallow(<Overview {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
