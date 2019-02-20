/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { EditType } from '../EditType';

const mockProps = {
  initialValues: {},
  onComplete: () => {},
  createType: () => {},
  updateType: () => {},
  submitForm: () => {},
};

describe('<EditType />', () => {
  it('can render', () => {
    const component = shallow(<EditType {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
