/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import CodeView from '../CodeView';

const mockProps = {
  toggleCodeView: () => {},
};

describe('<CodeView />', () => {
  it('can render', () => {
    const subject = shallow(<CodeView {...mockProps} />);
    expect(subject).toMatchSnapshot();
  });
});
