/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Variable } from '../Variable';

const mockProps = {
  form: 'foo',
  fieldId: 'bar',
  handleDelete: jest.fn(),
  resetOptions: jest.fn(),
};

describe('<Variable />', () => {
  it('can render', () => {
    const subject = shallow(<Variable {...mockProps} />);
    expect(subject).toMatchSnapshot();
  });

  it('shows validations when variable type is set', () => {
    const typeSubject = shallow(
      <Variable
        {...mockProps}
        variableType="text"
      />,
    );

    expect(typeSubject.find('Validations').exists()).toBe(true);

    const subject = shallow(
      <Variable
        {...mockProps}
      />,
    );

    expect(subject.find('Validations').exists()).toBe(false);
  });

  it('shows options when ordinal or categorical', () => {
    const ordinalSubject = shallow(
      <Variable
        {...mockProps}
        variableType="ordinal"
      />,
    );

    expect(ordinalSubject.find('Options').exists()).toBe(true);

    const categoricalSubject = shallow(
      <Variable
        {...mockProps}
        variableType="categorical"
      />,
    );

    expect(categoricalSubject.find('Options').exists()).toBe(true);
    const textSubject = shallow(
      <Variable
        {...mockProps}
        variableType="text"
      />,
    );

    expect(textSubject.find('Options').exists()).toBe(false);
  });
});
