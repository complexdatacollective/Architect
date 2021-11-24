/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { getFormSyncErrors } from 'redux-form';
import Issues from '../Issues';

jest.mock('redux-form');

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
  it('will render', () => {
    const component = shallow((
      <Provider store={mockStore}>
        <Issues {...mockProps} />
      </Provider>
    ));

    expect(component).toMatchSnapshot();
  });

  it('renders issues from object', () => {
    getFormSyncErrors.mockImplementationOnce(() => () => mockIssues);

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
