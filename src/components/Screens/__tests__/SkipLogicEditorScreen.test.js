/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import SkipLogicEditorScreen from '../SkipLogicEditorScreen';

const mockProps = {
};

describe('<EditForm />', () => {
  it('can render', () => {
    const component = shallow(<SkipLogicEditorScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
