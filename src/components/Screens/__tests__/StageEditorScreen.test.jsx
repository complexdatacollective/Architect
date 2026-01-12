/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import StageEditorScreen from '../StageEditorScreen';

const mockState = {
  protocol: {
    present: {
    },
  },
};

const mockProps = {
  show: true,
  store: createStore(() => mockState),
};

describe('<StageEditorScreen />', () => {
  it('can render', () => {
    const component = shallow(<StageEditorScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it.skip('hides preview button when form is invalid', () => {});
});
