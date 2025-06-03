/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { OrderedList } from '../OrderedList';

const mockProps = {
  input: {
    value: '',
  },
  form: 'form',
  item: () => {},
  disabled: false,
};

const className = 'list';

describe('<OrderedList />', () => {
  describe('errors', () => {
    it('shows no errors by default', () => {
      const props = {
        meta: {
          dirty: false,
          submitFailed: false,
          error: null,
        },
      };
      const component = shallow(<OrderedList {...mockProps} {...props} />);

      expect(component.exists(`.${className}__error`)).toBe(false);
    });

    it('shows error on submit', () => {
      const props = {
        meta: {
          submitFailed: true,
          error: 'foo',
        },
      };
      const component = shallow(<OrderedList {...mockProps} {...props} />);

      expect(component.exists(`.${className}__error`)).toBe(true);
    });

    it('shows error on changed', () => {
      const props = {
        meta: {
          dirty: true,
          error: 'foo',
        },
      };
      const component = shallow(<OrderedList {...mockProps} {...props} />);

      expect(component.exists(`.${className}__error`)).toBe(true);
    });
  });
});
