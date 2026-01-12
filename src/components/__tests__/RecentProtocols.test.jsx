/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { UnconnectedRecentProtocols } from '../RecentProtocols';

const mockProps = {
  recentProtocols: [],
};

describe('<RecentProtocols />', () => {
  it('can render?', () => {
    const component = shallow(<UnconnectedRecentProtocols {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
