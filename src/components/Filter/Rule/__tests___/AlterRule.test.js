/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { AlterRule } from '../AlterRule';

const mockProps = {
  id: '123',
  onUpdateRule: () => {},
  onDeleteRule: () => {},
  options: {
    type: '',
    operator: '',
    attribute: '',
    value: '',
  },
  nodeTypes: ['foo', 'bar'],
  valueInputType: undefined,
  nodeAttributes: {
    foo: ['baz', 'buzz'],
  },
};

describe('<AlterRule />', () => {
  it('can render', () => {
    const component = shallow(<AlterRule {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
