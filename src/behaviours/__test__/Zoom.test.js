/* eslint-env jest */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { shallow } from 'enzyme';
import Zoom from '../Zoom';

const mockProps = {
};

describe('<Zoom />', () => {
  it('can render', () => {
    shallow(<Zoom {...mockProps}>Foo</Zoom>);
  });
});
