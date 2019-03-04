/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { FormEditorScreen } from '../FormEditorScreen';

const mockProps = {
  updateForm: () => {},
  createForm: () => {},
  submitForm: () => {},
  onComplete: () => {},
};

describe('<FormEditorScreen />', () => {
  it('can render', () => {
    const component = shallow(<FormEditorScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
