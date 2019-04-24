/* eslint-env jest */

import React from 'react';
import { reduxForm } from 'redux-form';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SociogramPrompts from '../SociogramPrompts';

/* eslint-disable */
const MockComponent = ({ children }) => (
  <div>
    {children}
  </div>
);

const MockForm = reduxForm({
  form: 'foo',
  onSubmit: () => {},
})(MockComponent);
/* eslint-enable */

describe('<SociogramPrompts />', () => {
  describe('when connected', () => {
    let subject;
    beforeEach(() => {
      const store = createStore(() => ({}));
      const props = { form: 'myForm' };
      const provider = mount((
        <Provider store={store}>
          <MockForm>
            <SociogramPrompts {...props} />
          </MockForm>
        </Provider>
      ));
      subject = provider.find('SociogramPrompts');
    });

    it('defines sortOrder for new prompts', async () => {
      const initialValues = subject.find('EditableList').prop('initialValues');
      expect(initialValues).toMatchObject({ sortOrder: [] });
    });
  });
});
