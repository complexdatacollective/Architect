/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { UnconnectedTypeEditor } from '../TypeEditor';
import Variables from '../Variables';

const mockProps = {
  dirty: false,
  valid: true,
  handleSubmit: () => {},
  displayVariables: [],
  form: 'TYPE_EDITOR',
  toggleCodeView: () => {},
  showCodeView: true,
  autofill: () => {},
  existingTypes: [],
  nameTouched: false,
};

const variablesProps = {
  form: mockProps.form,
  name: 'variables',
  sortableProperties: ['name', 'type'],
  initialSortOrder: {
    direction: 'asc',
    property: 'name',
  },
};

describe('<TypeEditor />', () => {
  it('passes correct props to Variables', () => {
    const subject = shallow(<UnconnectedTypeEditor {...mockProps} entity="node" />);

    const variables = subject.find('Variables');

    expect(variables.props()).toMatchObject({
      form: 'TYPE_EDITOR',
      initialSortOrder: {
        direction: 'asc',
        property: 'name',
      },
      name: 'variables',
      sortableProperties: ['name', 'type'],
    });
  });

  it('it renders the correct sections for a node', () => {
    const subject = shallow(<UnconnectedTypeEditor {...mockProps} entity="node" />);

    expect(subject.containsAllMatchingElements([
      <h2>Color</h2>,
      <h2>Icon</h2>,
      <h2>Display Variable</h2>,
      <Variables {...variablesProps} />,
    ])).toBe(true);
  });

  it('it renders the correct sections for an edge', () => {
    const subject = shallow(<UnconnectedTypeEditor {...mockProps} entity="edge" />);

    expect(subject.containsAllMatchingElements([
      <h2>Color</h2>,
      <Variables {...variablesProps} />,
    ])).toBe(true);

    expect(subject.containsAllMatchingElements([
      <h2>Icon</h2>,
      <h2>Display Variable</h2>,
    ])).toBe(false);
  });

  it('if "new" hides variable secion', () => {
    const subject = shallow(<UnconnectedTypeEditor {...mockProps} entity="node" isNew />);

    expect(subject.containsAllMatchingElements([
      <h2>Display Variable</h2>,
      <Variables {...variablesProps} />,
    ])).toBe(false);
  });
});
