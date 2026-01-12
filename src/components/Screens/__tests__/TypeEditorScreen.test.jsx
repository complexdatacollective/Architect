/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import TypeEditorScreen from '../TypeEditorScreen';

const mockProps = {
};

describe('<TypeEditorScreen />', () => {
  it('can render', () => {
    const component = shallow(<TypeEditorScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
