/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import ViewFormsScreen from '../ViewFormsScreen';

const mockState = {
  protocol: {
    present: {
    },
  },
};

const mockProps = {
  store: createStore(() => mockState),
};

describe('<ViewFormsScreen />', () => {
  it('can render', () => {
    const component = shallow(<ViewFormsScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
