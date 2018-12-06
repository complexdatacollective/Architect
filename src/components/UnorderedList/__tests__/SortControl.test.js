/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import SortControl from '../SortControl';

const mockProps = {
  onChange: () => {},
  sortableProperties: [],
  sortOrder: {},
};

describe('<SortControl />', () => {
  it('renders buttons for each sortable property', () => {
    expect(
      shallow(<SortControl {...mockProps} />)
        .containsMatchingElement('Button'),
    ).toBe(false);

    expect(
      shallow(<SortControl {...mockProps} sortableProperties={['foo', 'bar']} />)
        .find('Button').length,
    ).toBe(2);
  });

  it('calls onChange for button clicks', () => {
    const onChange = jest.fn();
    const subject = shallow((
      <SortControl
        {...mockProps}
        sortableProperties={['foo', 'bar']}
        onChange={onChange}
      />
    ));

    subject.find('Button').first().simulate('click');

    const expectedValueOfSortOrder = { direction: 'desc', property: 'foo' };

    expect(onChange.mock.calls[0]).toEqual([expectedValueOfSortOrder]);
  });

  it('toggles sort order', () => {
    const startingSortOrder = { direction: 'desc', property: 'foo' };

    const onChange = jest.fn();
    const subject = shallow((
      <SortControl
        {...mockProps}
        sortableProperties={['foo', 'bar']}
        sortOrder={startingSortOrder}
        onChange={onChange}
      />
    ));

    subject.find('Button').first().simulate('click');

    const nextExpectedValueOfSortOrder = { direction: 'asc', property: 'foo' };

    expect(onChange.mock.calls[0]).toEqual([nextExpectedValueOfSortOrder]);
  });
});
