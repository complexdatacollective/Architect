/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SociogramPrompts from '../SociogramPrompts';

jest.mock('../../../../Guidance');

describe('<SociogramPrompts />', () => {
  describe('when connected', () => {
    let subject;
    beforeEach(() => {
      const store = createStore(() => ({}));
      const props = { form: 'myForm' };
      const provider = mount(<Provider store={store}><SociogramPrompts {...props} /></Provider>);
      subject = provider.find('SociogramPrompts');
    });

    it('defines sortOrder for new prompts', async () => {
      const initialValues = subject.find('EditableList').prop('initialValues');
      expect(initialValues).toMatchObject({ sortOrder: [] });
    });
  });
});
