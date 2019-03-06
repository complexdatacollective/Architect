/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import VariableRegistryScreen from '../VariableRegistryScreen';

const mockState = {
  protocol: {
    present: {
      stages: [],
    },
  },
};

const mockProps = {
  store: createStore(() => mockState),
};

describe('<VariableRegistryScreen />', () => {
  it('can render', () => {
    const component = shallow(<VariableRegistryScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
