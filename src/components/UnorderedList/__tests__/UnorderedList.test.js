/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import UnorderedList from '../UnorderedList';

const MockItem = () => {};

const mockProps = {
  items: [],
  item: MockItem,
};

describe('<UnorderedList />', () => {
  it('renders a list of Item', () => {
    const subject = shallow((
      <UnorderedList
        {...mockProps}
        items={[
          { foo: 'bar', index: 'bar', fieldId: 'bar' },
          { bazz: 'buzz', index: 'buzz', fieldId: 'buzz' },
        ]}
      />
    ));

    expect(subject.find('MockItem').length).toBe(2);
  });

  it('filters according to filter() and parmeters object', () => {
    const mockFilter = (list, parameters) => {
      if (!parameters.index) { return list; }
      return [list[parameters.index]];
    };

    const subject = shallow((
      <UnorderedList
        {...mockProps}
        items={[
          { foo: 'bar', index: 0, fieldId: 'bar' },
          { foo: 'bazz', index: 1, fieldId: 'bazz' },
          { foo: 'buzz', index: 2, fieldId: 'buzz' },
        ]}
        filter={mockFilter}
      />
    ));

    subject.instance().handleUpdateParameters({ index: 1 });

    expect(subject.find('MockItem').at(0).prop('fieldId')).toEqual('bazz');
  });

  it('parameters are controlled by Controls', () => {
    const MockControls = () => {};

    const subject = shallow((
      <UnorderedList
        {...mockProps}
        controls={MockControls}
      />
    ));

    subject.find('MockControls').first().prop('onChange')({ foo: 'bar' });

    expect(subject.state('parameters')).toMatchObject({ foo: 'bar' });
  });
});
