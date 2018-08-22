/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { RecentProtocols } from '../RecentProtocols';

const mockProps = {
  recentProtocols: [],
};

describe('<RecentProtocols />', () => {
  it('can render?', () => {
    const component = shallow(<RecentProtocols {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
