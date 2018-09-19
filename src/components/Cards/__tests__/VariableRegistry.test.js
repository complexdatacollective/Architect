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
  deleteTypeAndRelatedObjects: () => {},
  protocolPath: '',
};

describe('<VariableRegistry />', () => {
  it('can render', () => {
    const component = shallow(<VariableRegistry {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
