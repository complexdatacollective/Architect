/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { NewStage } from '../NewStage';

const mockProps = {
  addStage: () => {},
};

describe('<NewStage />', () => {
  it('can render', () => {
    const component = shallow(<NewStage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('addStage() on click', () => {
    const mockAddStage = jest.fn();

    const component = shallow(<NewStage addStage={mockAddStage} />);

    component.find('.new-stage__option').first().simulate('click');

    expect(mockAddStage.mock.calls.length).toEqual(1);
  });
});
