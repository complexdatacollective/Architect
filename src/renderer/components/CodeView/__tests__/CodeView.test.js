/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { getFormValues } from 'redux-form';
import CodeView from '../CodeView';

jest.mock('redux-form');

const mockProps = {
  toggleCodeView: () => {},
  form: 'test',
};

const mockStore = createStore(() => ({
}));

describe('<CodeView />', () => {
  beforeAll(() => {
    getFormValues.mockImplementation(() => () => ({ name: 'example name' }));
  });

  it('can render', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <CodeView {...mockProps} />
      </Provider>
    ));

    expect(subject).toMatchSnapshot();
  });

  it('renders content only when show is true', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <CodeView {...mockProps} show />
      </Provider>
    ));

    expect(subject).toMatchSnapshot();
  });
});
