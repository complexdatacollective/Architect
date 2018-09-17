/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ContentGrid } from '../ContentGrid';

const mockProps = {
  createNewItem: () => {},
  spareCapacity: 0,
  setInputType: () => {},
  form: {},
};

describe('<ContentGrid />', () => {
  it('New button hidden when spareCapacity is 0', () => {
    const component = shallow(<ContentGrid {...mockProps} />);

    expect(component.find('NewButton').exists()).toBe(false);
  });

  it('New button trigger createNewItem', () => {
    const createNewItemHandler = jest.fn(() => 'foo');
    const component = shallow((
      <ContentGrid
        {...mockProps}
        spareCapacity={1}
        createNewItem={createNewItemHandler}
      />
    ));

    component.find('NewButton').simulate('click');

    expect(createNewItemHandler.mock.calls.length).toBe(1);
    expect(component.state('editing')).toBe('foo');
  });

  it('toggle item edit changes state', () => {
    const component = shallow(<ContentGrid {...mockProps} />);

    component.instance().handleToggleItemEdit('bar');
    expect(component.state('editing')).toBe('bar');

    component.instance().handleToggleItemEdit('bar');
    expect(component.state('editing')).toBe(null);
  });
});
