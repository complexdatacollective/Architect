/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { TypeEditor } from '../TypeEditor';
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
  it('can render for node', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="node" />);
    expect(subject).toMatchSnapshot();
  });

  it('can render for edge', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="edge" />);
    expect(subject).toMatchSnapshot();
  });

  it('passes correct props to Variables', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="node" />);

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
    const subject = shallow(<TypeEditor {...mockProps} category="node" />);

    expect(subject.containsAllMatchingElements([
      <h2>Color</h2>,
      <h2>Icon</h2>,
      <h2>Display Variable</h2>,
      <Variables {...variablesProps} />,
    ])).toBe(true);
  });

  it('it renders the correct sections for an edge', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="edge" />);

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
    const subject = shallow(<TypeEditor {...mockProps} category="node" isNew />);

    expect(subject.containsAllMatchingElements([
      <h2>Display Variable</h2>,
      <Variables {...variablesProps} />,
    ])).toBe(false);
  });
});
