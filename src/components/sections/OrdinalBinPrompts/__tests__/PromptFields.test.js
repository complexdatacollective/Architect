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

const mockStore = getStore({
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
});

const MockForm = reduxForm({
  form: mockFormName,
})(
  ({ handleSubmit, children }) => (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  ),
);

const getSubject = (node, { form }) =>
  mount((
    <Provider store={mockStore}>
      <MockForm {...form}>
        {node}
      </MockForm>
    </Provider>
  ));

describe('PromptFields', () => {
  it('when variable is changed variable options are updated', () => {
    const subject = getSubject((
      <PromptFields
        form={mockFormName}
        entity="node"
        type="person"
      />
    ),
    { form: { initialValues: { variable: 'bazz', variableOptions: ['a', 'b', 'c', 'd'] } } });

    expect(subject.find(Options).find(Item).length).toBe(4);

    const dropdownChangeHandler = subject.find(ValidatedField)
      .filter('[name="variable"]')
      .prop('onChange');

    dropdownChangeHandler(null, 'buzz');

    subject.update();

    expect(subject.find(Options).find(Item).length).toBe(2);
  });
});
