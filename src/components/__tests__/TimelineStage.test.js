/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import TimelineStage from '../TimelineStage';

const mockProps = {
  type: 'Foo',
  onEditStage: () => {},
  onEditSkipLogic: () => {},
};

describe('<TimelineStage />', () => {
  it('can render', () => {
    const component = shallow(<TimelineStage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
