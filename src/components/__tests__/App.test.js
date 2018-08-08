/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';

const mockProps = {
  location: { pathname: '' },
  resetActiveProtocol: () => {},
};

const platform = global.process.platform;

describe('<App />', () => {
  afterAll(() => {
    global.process.platform = platform;
  });

  it('renders with titlebar on darwin', () => {
    global.process.platform = 'darwin';

    const component = shallow(<App {...mockProps} />);

    expect(component.hasClass('app--macos')).toBe(true);
    expect(component.contains(<div className="app__electron-titlebar" />)).toBe(true);
  });

  it('renders without titlebar on not darwin', () => {
    global.process.platform = 'windows';

    const component = shallow(<App {...mockProps} />);

    expect(component.hasClass('app--macos')).toBe(false);
    expect(component.contains(<div className="app__electron-titlebar" />)).toBe(false);
  });

  it('has `.app--start` class if path is root', () => {
    const componentAtFoo = shallow(<App {...mockProps} location={{ pathname: '/foo' }} />);
    expect(componentAtFoo.hasClass('app--start')).toBe(false);

    const componentAtRoot = shallow(<App {...mockProps} location={{ pathname: '/' }} />);
    expect(componentAtRoot.hasClass('app--start')).toBe(true);
  });
});
