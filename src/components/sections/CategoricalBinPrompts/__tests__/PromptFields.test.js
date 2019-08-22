/* eslint-env jest */
import React from 'react';
import { Provider } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mount } from 'enzyme';
import Options, { Item } from '../../../Options';
import { ValidatedField } from '../../../Form';
import PromptFields from '../PromptFields';
import { getStore } from '../../../../ducks/store';

const mockFormName = 'foo';

const initialState = {
  protocol: {
    timeline: [],
    present: {
      codebook: {
        node: {
          person: {
            variables: {
              bazz: {
                options: ['a', 'b', 'c', 'd'],
              },
              buzz: {
                options: [1, 2],
              },
            },
          },
        },
      },
    },
  },
};

const MockForm = reduxForm({
  form: mockFormName,
})(
  ({ handleSubmit, children }) => (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  ),
);


const getSubject = (node, store, { form }) =>
  mount((
    <Provider store={store}>
      <MockForm {...form}>
        {node}
      </MockForm>
    </Provider>
  ));

// eslint-disable-next-line import/prefer-default-export
export const testPromptFields = (PromptFieldsComponent) => {
  let mockStore;

  beforeEach(() => {
    mockStore = getStore(initialState);
  });

  describe('PromptFields', () => {
    it('when variable is created, variable options are updated', () => {
      const formProps = { initialValues: { variable: 'bazz', variableOptions: ['a', 'b', 'c', 'd'] } };
      const additionalProps = { form: formProps };

      const subject = getSubject(
        (
          <PromptFieldsComponent
            form={mockFormName}
            entity="node"
            type="person"
          />
        ),
        mockStore,
        additionalProps,
      );

      expect(subject.find(Options).find(Item).length).toBe(4);

      const newVariableHandler = subject.find('NewVariableWindow')
        .prop('onComplete');

      newVariableHandler('buzz');

      subject.update();

      expect(subject.find(Options).find(Item).length).toBe(2);
    });

    it('when variable is changed, variable options are updated', () => {
      const formProps = { initialValues: { variable: 'bazz', variableOptions: ['a', 'b', 'c', 'd'] } };
      const additionalProps = { form: formProps };

      const subject = getSubject(
        (
          <PromptFieldsComponent
            form={mockFormName}
            entity="node"
            type="person"
          />
        ),
        mockStore,
        additionalProps,
      );

      expect(subject.find(Options).find(Item).length).toBe(4);

      const dropdownChangeHandler = subject.find(ValidatedField)
        .filter('[name="variable"]')
        .prop('onChange');

      dropdownChangeHandler(null, 'buzz');

      subject.update();

      expect(subject.find(Options).find(Item).length).toBe(2);
    });
  });
};

testPromptFields(PromptFields);
