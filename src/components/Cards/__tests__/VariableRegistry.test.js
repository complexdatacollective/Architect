/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { VariableRegistry } from '../VariableRegistry';

const mockProps = {
  variableRegistry: {
    node: {},
    edge: {},
  },
  getUsageForType: () => {},
  deleteType: () => {},
  protocolPath: '',
  getDeleteImpact: () => {},
  getObjectLabel: () => {},
};

describe('<VariableRegistry />', () => {
  it('can render', () => {
    const component = shallow(<VariableRegistry {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
