/* eslint-env jest */

import React from 'react';
import { toPairs } from 'lodash';
import { shallow } from 'enzyme';
import DropDown from '../DropDown';

const mockProps = {
  options: toPairs({
    foo: 'bar',
    baz: 'buzz',
  }),
  value: '',
  onChange: () => {},
};

describe('<DropDown />', () => {
  it('can render without labels', () => {
    const component = shallow(<DropDown {...mockProps} />);

    expect(component).toMatchSnapshot();

    const firstOption = component.find('option').at(0);
    expect([
      firstOption.prop('value'),
      firstOption.text(),
    ]).toEqual(['foo', 'bar']);
  });

  it('can render with labels', () => {
    const options = ['foo', 'bar', 'baz'];
    const component = shallow(<DropDown {...mockProps} options={options} />);

    expect(component).toMatchSnapshot();

    const firstOption = component.find('option').at(0);

    expect([
      firstOption.prop('value'),
      firstOption.text(),
    ]).toEqual(['foo', 'foo']);
  });

  it('it triggers on change with the option value', () => {
    const onChange = jest.fn();
    const component = shallow(<DropDown {...mockProps} onChange={onChange} />);

    component.find('select').simulate('change', { target: { value: 'foo' } });
    expect(onChange.mock.calls).toEqual([['foo']]);
  });
});
