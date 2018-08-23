/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ViewForms } from '../ViewForms';

const mockProps = {
  forms: {},
  nodes: {},
  deleteForm: () => {},
};

describe('<ViewForms />', () => {
  it('can render', () => {
    const component = shallow(<ViewForms {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
