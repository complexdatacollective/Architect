/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Items } from '../Items';

const mockProps = {
  fields: {
    map: () => {},
  },
  itemComponent: () => {},
  disabled: false,
};

describe('<Items />', () => {
  describe('errors', () => {
    it('shows no errors by default', () => {
      const props = {
        meta: {
          dirty: false,
          submitFailed: false,
          error: null,
        },
      };
      const component = shallow(<Items {...mockProps} {...props} />);

      expect(component.exists('.items__error')).toBe(false);
    });

    it('shows error on submit', () => {
      const props = {
        meta: {
          submitFailed: true,
          error: 'foo',
        },
      };
      const component = shallow(<Items {...mockProps} {...props} />);

      expect(component.exists('.items__error')).toBe(true);
    });

    it('shows error on changed', () => {
      const props = {
        meta: {
          dirty: true,
          error: 'foo',
        },
      };
      const component = shallow(<Items {...mockProps} {...props} />);

      expect(component.exists('.items__error')).toBe(true);
    });
  });
});
