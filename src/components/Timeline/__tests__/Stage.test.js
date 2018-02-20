/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Stage from '../Stage';

const mockProps = {
  type: 'Foo',
  onEditStage: () => {},
  onEditSkipLogic: () => {},
};

describe('<Stage />', () => {
  it('can render', () => {
    const component = shallow(<Stage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
