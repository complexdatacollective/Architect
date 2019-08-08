/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { CheckboxGroup, Checkbox } from '@ui/components/Fields';
import RadioCheckbox from '../RadioCheckbox';

const getMockInput = (values = {}) => ({
  onChange: jest.fn(),
  value: [],
  ...values,
});

const getSubject = (props, renderer = shallow) =>
  renderer(<RadioCheckbox {...props} />);

const toggleCheckbox = checkbox =>
  checkbox.find('input').simulate('change', { target: { checked: true } });

describe('RadioCheckbox', () => {
  it('sets input value correctly', () => {
    const subject = getSubject({ input: getMockInput({ value: ['foo'] }) });
    const checkboxGroupInput = subject.find(CheckboxGroup).prop('input');
    expect(checkboxGroupInput.value).toEqual(['foo']);
  });

  describe('translates RadioCheckbox onChange to singular value', () => {
    const options = [{ value: 'foo', label: 'foo' }, { value: 'bar', label: 'bar' }];

    it('from null value', () => {
      const input = getMockInput();
      const subject = getSubject({ input, options }, mount);

      const checkbox = subject.find(Checkbox).at(0);
      toggleCheckbox(checkbox);

      // One call to onChange as: onChange(['foo'])
      expect(input.onChange.mock.calls).toEqual([[['foo']]]);
    });
    it('from null value', () => {
      const input = getMockInput({ value: ['foo'] });
      const subject = getSubject({ input, options }, mount);

      const checkbox = subject.find(Checkbox).at(1);
      toggleCheckbox(checkbox);

      // One call to onChange as: onChange(['bar'])
      expect(input.onChange.mock.calls).toEqual([[['bar']]]);
    });
  });
});
