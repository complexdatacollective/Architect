/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import RuleInput from '../RuleInput';

const mockProps = {
  value: '',
  onChange: () => {},
};

describe('<RuleInput />', () => {
  it('can render', () => {
    const component = shallow(<RuleInput {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('can render as number', () => {
    const options = {
      ...mockProps,
      type: 'number',
    };

    const component = shallow(<RuleInput {...options} />);

    expect(component).toMatchSnapshot();
    expect(component.find('input').prop('type')).toEqual('number');
  });

  it('can prepopulate a value', () => {
    const options = {
      ...mockProps,
      value: 'foo',
    };

    const component = shallow(<RuleInput {...options} />);

    expect(component).toMatchSnapshot();

    expect(component.find('input').prop('value')).toEqual('foo');
  });

  it('it triggers onChange with value', () => {
    const onChange = jest.fn();
    const options = {
      ...mockProps,
      onChange,
    };

    const component = shallow(<RuleInput {...options} />);

    component.find('input').simulate('change', { target: { value: 'bar' } });

    expect(onChange.mock.calls).toEqual([['bar']]);
  });
});
