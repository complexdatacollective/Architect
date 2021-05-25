/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import App from '../ViewManager/views/App';

const mockProps = {
  location: { pathname: '' },
};

const { process } = global;

jest.mock('../../hooks/useUpdater');

describe('<App />', () => {
  afterAll(() => {
    global.process = process;
  });

  it('renders with titlebar on darwin', () => {
    global.process = { ...global.process, platform: 'darwin' };

    const component = shallow(<App {...mockProps} />);
    expect(component.find('.app').hasClass('app--macos')).toBe(true);
    expect(component.find('.electron-titlebar').length).toBe(1);
  });

  it('renders without titlebar on not darwin', () => {
    global.process = { ...global.process, platform: 'windows' };

    const component = shallow(<App {...mockProps} />);
    expect(component.find('.app').hasClass('app--macos')).toBe(false);
    expect(component.find('.electron-titlebar').length).toBe(0);
  });
});
