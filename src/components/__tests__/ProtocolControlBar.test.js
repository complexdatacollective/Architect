/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ProtocolControlBar } from '../ProtocolControlBar';

const mockProps = {
  hasUnsavedChanges: false,
  saveProtocol: () => {},
};

describe('<ProtocolControlBar />', () => {
  it('can render?', () => {
    const component = shallow(<ProtocolControlBar {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
