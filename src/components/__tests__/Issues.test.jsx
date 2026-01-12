/* eslint-env jest */
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const mockGetFormSyncErrors = vi.fn(() => () => ({}));

vi.mock('redux-form', () => ({
  getFormSyncErrors: mockGetFormSyncErrors,
}));

// Import Issues after mock is set up
const { default: Issues } = await import('../Issues');

const mockIssues = {
  foo: 'bar',
  baz: [
    {
      buzz: 'foo',
      beep: 'boop',
    },
  ],
};

const mockProps = {
  form: 'test',
  show: true,
  hideIssues: () => {},
};

const mockStore = createStore(() => ({}));

describe('<Issues />', () => {
  beforeEach(() => {
    mockGetFormSyncErrors.mockReset();
    mockGetFormSyncErrors.mockReturnValue(() => ({}));
  });

  it('will render', () => {
    const component = shallow((
      <Provider store={mockStore}>
        <Issues {...mockProps} />
      </Provider>
    ));

    expect(component).toMatchSnapshot();
  });

  it('renders issues from object', () => {
    mockGetFormSyncErrors.mockReturnValue(() => mockIssues);

    const component = mount((
      <Provider store={mockStore}>
        <Issues
          {...mockProps}
          show
        />
      </Provider>
    ));

    expect(component.find('li.issues__issue').length).toBe(3);
  });
});
