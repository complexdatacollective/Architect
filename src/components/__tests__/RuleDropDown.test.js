/* eslint-env jest */

import React from 'react';
import { toPairs } from 'lodash';
import { shallow } from 'enzyme';
import RuleDropDown from '../RuleDropDown';

const mockProps = {
  options: toPairs({
    foo: 'bar',
    baz: 'buzz',
  }),
  value: '',
  onChange: () => {},
};

describe('<RuleDropDown />', () => {
  it('can render without labels', () => {
    const component = shallow(<RuleDropDown {...mockProps} />);

    expect(component).toMatchSnapshot();

    const firstOption = component.find('option').at(0);
    expect([
      firstOption.prop('value'),
      firstOption.text()
    ]).toEqual(['foo', 'bar']);
  });

  it('can render with labels', () => {
    const options = ['foo', 'bar', 'baz'];
    const component = shallow(<RuleDropDown {...mockProps} options={options} />);

    expect(component).toMatchSnapshot();

    const firstOption = component.find('option').at(0);

    expect([
      firstOption.prop('value'),
      firstOption.text()
    ]).toEqual(['foo', 'foo']);
  });

  it('it triggers on change with the option value', () => {
    const onChange = jest.fn();
    const component = shallow(<RuleDropDown {...mockProps} onChange={onChange} />);

    component.find('select').simulate('change', { target: { value: 'foo' } });
    expect(onChange.mock.calls).toEqual([['foo']]);
  });
});
