/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ItemPreview } from '../ItemPreview';
import { sizes } from '../sizes';

const mockProps = {
  onDeleteItem: () => {},
};

describe('<ItemPreview />', () => {
  it('adds size class', () => {
    const component = shallow(<ItemPreview {...mockProps} size={sizes.MEDIUM} />);

    expect(component.hasClass(`content-grid-preview--size-${sizes.MEDIUM}`)).toBe(true);
  });

  it('adds type class', () => {
    const component = shallow(<ItemPreview {...mockProps} type="text" />);

    expect(component.hasClass('content-grid-preview--type-text')).toBe(true);
  });

  it('triggers delete on click', () => {
    const deleteHandler = jest.fn();
    const component = shallow(<ItemPreview {...mockProps} onDeleteItem={deleteHandler} />);

    component.find('DeleteButton').simulate('click');

    expect(deleteHandler.mock.calls.length).toBe(1);
  });
});
