/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import CodebookScreen from '../CodebookScreen';

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

describe('<CodebookScreen />', () => {
  it('can render', () => {
    const component = shallow(<CodebookScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
