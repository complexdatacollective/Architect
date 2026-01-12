/* eslint-env jest */
import { vi, describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import VariablePicker from '../VariablePicker';

const mockStore = createStore(() => ({
  protocol: {
    present: {
      codebook: {
        node: {
          person: {
            variables: {
              age: {},
            },
          },
        },
        edge: {},
        ego: {},
      },
    },
  },
}));

describe('VariablePicker', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('when no variable is selected it renders the select variable button', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <VariablePicker
          entity=""
          type=""
          label=""
          options={[
            // {label, value, type}
          ]}
          meta={{}}
          input={{
            value: '',
            onChange: noop,
          }}
          onCreateOption={noop}
        />
      </Provider>
    ));

    // The mock Button component renders children directly without a span
    expect(subject.find('button').text()).toContain('Select Variable');
  });

  it('when selected variable has type it renders the EditableVariablePill', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <VariablePicker
          entity=""
          type=""
          label=""
          options={[
            {
              label: 'Just a number',
              value: 'age',
              type: 'number',
            },
          ]}
          meta={{}}
          input={{
            value: 'age',
            onChange: noop,
          }}
          onCreateOption={noop}
        />
      </Provider>
    ));

    expect(subject.find('button').text()).toContain('Change Variable');
    expect(subject.exists('Memo(EditableVariablePill)')).toBe(true);
  });

  it('when selected has no type it renders the SimpleVariablePill', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <VariablePicker
          entity=""
          type=""
          label=""
          options={[
            {
              label: 'Just a number',
              value: 'age',
            },
          ]}
          meta={{}}
          input={{
            value: 'age',
            onChange: noop,
          }}
          onCreateOption={noop}
        />
      </Provider>
    ));

    expect(subject.find('button').text()).toContain('Change Variable');
    expect(subject.exists('SimpleVariablePill')).toBe(true);
  });
});
