/* eslint-env jest */
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import { mount } from 'enzyme';
import { getStore } from '../../../../ducks/store';
import Options from '../../../Options/Options';
import Option from '../../../Options/Option';
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
                name: 'bazz',
                type: 'categorical',
                options: [
                  { value: 'a', label: 'a' },
                  { value: 'b', label: 'b' },
                  { value: 'c', label: 'c' },
                  { value: 'd', label: 'd' },
                ],
              },
              buzz: {
                name: 'buzz',
                type: 'categorical',
                options: [
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                ],
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

const getSubject = (node, store, { form }) => mount((
  <Provider store={store}>
    <MockForm {...form}>
      {node}
    </MockForm>
  </Provider>
));

// eslint-disable-next-line import/prefer-default-export
export const testPromptFields = (PromptFieldsComponent, name = '') => {
  let mockStore;

  beforeEach(() => {
    mockStore = getStore(initialState);
  });

  describe(name, () => {
    describe('PromptFields', () => {
      it('when variable is created, variable options are updated', () => {
        const formProps = {
          initialValues: {
            variable: 'bazz',
            variableOptions: [
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
            ],
          },
        };
        const additionalProps = { form: formProps };

        const subject = getSubject(
          (
            <PromptFieldsComponent
              form={mockFormName}
              entity="node"
              type="person"
              handleDeleteVariable={vi.fn()}
              handleUpdate={vi.fn()}
            />
          ),
          mockStore,
          additionalProps,
        );

        // The Options component renders Option children based on variableOptions
        expect(subject.find(Options).find(Option).length).toBe(2);

        // Create a new variable in the codebook
        mockStore.dispatch(codebookActions.createVariable(
          'node',
          'person',
          {
            name: 'fizz',
            type: 'categorical',
            options: [
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
            ],
          },
        ));

        // Change the form's variableOptions to have 3 items
        mockStore.dispatch(change(
          mockFormName,
          'variableOptions',
          [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
          ],
        ));

        subject.update();

        expect(subject.find(Options).find(Option).length).toBe(3);
      });

      it('when variable is changed, variable options are updated', () => {
        const formProps = {
          initialValues: {
            variable: 'bazz',
            variableOptions: [
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
            ],
          },
        };
        const additionalProps = { form: formProps };

        const subject = getSubject(
          (
            <PromptFieldsComponent
              form={mockFormName}
              entity="node"
              type="person"
              handleDeleteVariable={vi.fn()}
              handleUpdate={vi.fn()}
            />
          ),
          mockStore,
          additionalProps,
        );

        expect(subject.find(Options).find(Option).length).toBe(2);

        // Change the variable and update variableOptions accordingly
        mockStore.dispatch(change(
          mockFormName,
          'variable',
          'buzz',
        ));

        mockStore.dispatch(change(
          mockFormName,
          'variableOptions',
          [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
          ],
        ));

        subject.update();

        expect(subject.find(Options).find(Option).length).toBe(2);
      });
    });
  });
};

testPromptFields(PromptFields);
