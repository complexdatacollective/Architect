/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { EditForm } from '../EditForm';

const mockProps = {
  updateForm: () => {},
  createForm: () => {},
  submitForm: () => {},
  onComplete: () => {},
};

describe('<EditForm />', () => {
  it('can render', () => {
    const component = shallow(<EditForm {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
