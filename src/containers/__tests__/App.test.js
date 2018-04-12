/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';

const mockProps = {
  location: { pathname: '' },
  resetActiveProtocol: () => {},
};

describe('<App />', () => {
  it('can render', () => {
    const component = shallow(<App {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('has `.app--start` class if path is root', () => {
    const componentAtFoo = shallow(<App {...mockProps} location={{ pathname: '/foo' }} />);
    expect(componentAtFoo.hasClass('app--start')).toBe(false);

    const componentAtRoot = shallow(<App {...mockProps} location={{ pathname: '/' }} />);
    expect(componentAtRoot.hasClass('app--start')).toBe(true);
  });
});
