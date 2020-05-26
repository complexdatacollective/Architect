/* eslint-env jest */
import React from 'react';
import { Provider } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import { mount } from 'enzyme';
import { getStore } from '../../../../ducks/store';
import Options, { Item } from '../../../Options';
import { actionCreators as codebookActions } from '../../../../ducks/modules/protocol/codebook';
import PromptFields from '../PromptFields';

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
            handleDeleteVariable={jest.fn()}
          />
        ),
        mockStore,
        additionalProps,
      );

      expect(subject.find(Options).find(Item).length).toBe(4);

      mockStore.dispatch(codebookActions.createVariable(
        'node',
        'person',
        {
          name: 'fizz',
          type: 'foo',
          options: [1, 2, 3],
        },
      ));

      mockStore.dispatch(change(
        mockFormName,
        'variable',
        '809895df-bbd7-4c76-ac58-e6ada2625f9b',
      ));

      subject.update();

      expect(subject.find(Options).find(Item).length).toBe(3);
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
            handleDeleteVariable={jest.fn()}
          />
        ),
        mockStore,
        additionalProps,
      );

      expect(subject.find(Options).find(Item).length).toBe(4);

      mockStore.dispatch(change(
        mockFormName,
        'variable',
        'buzz',
      ));

      subject.update();

      expect(subject.find(Options).find(Item).length).toBe(2);
    });
  });
};

testPromptFields(PromptFields);
