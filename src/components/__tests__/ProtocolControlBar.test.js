/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ProtocolControlBar } from '../ProtocolControlBar';

const mockProps = {
  saveProtocol: () => {},
  isSaving: false,
  isDisabled: false,
  showControlBar: true,
  hasUnsavedChanges: false,
  hasAnyStages: true,
  handleClickStart: () => {},
};

describe('<ProtocolControlBar />', () => {
  it('can render', () => {
    const component = shallow(<ProtocolControlBar {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
