/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Codebook } from '../Codebook';

const mockProps = {
  codebook: {
    node: {},
    edge: {},
  },
  getUsageForType: () => {},
  deleteType: () => {},
  protocolPath: '',
  getDeleteImpact: () => {},
  getObjectLabel: () => {},
  openDialog: () => {},
};

describe('<Codebook />', () => {
  it('can render', () => {
    const component = shallow(<Codebook {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
