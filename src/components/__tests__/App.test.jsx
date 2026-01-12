/* eslint-env jest */
import { vi, describe, it, expect, afterAll } from 'vitest';
import React from 'react';
import { shallow } from 'enzyme';

// Mock useUpdater before importing App
vi.mock('@hooks/useUpdater', () => ({
  default: vi.fn(() => null),
}));

// Mock platform utilities
const { mockIsMacOS } = vi.hoisted(() => ({
  mockIsMacOS: vi.fn(() => true),
}));

vi.mock('@app/utils/platform', () => ({
  isMacOS: mockIsMacOS,
}));

// Mock child components to simplify testing
vi.mock('@components/Errors', () => ({
  AppErrorBoundary: ({ children }) => children,
}));

vi.mock('@components/DialogManager', () => ({
  default: () => null,
}));

vi.mock('@components/Routes', () => ({
  default: () => null,
}));

vi.mock('@components/ToastManager', () => ({
  default: () => null,
}));

import App from '../ViewManager/views/App';

describe('<App />', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders with titlebar on darwin', () => {
    mockIsMacOS.mockReturnValue(true);

    const component = shallow(<App />);
    expect(component.find('.app').hasClass('app--macos')).toBe(true);
    expect(component.find('.electron-titlebar').length).toBe(1);
  });

  it('renders without titlebar on not darwin', () => {
    mockIsMacOS.mockReturnValue(false);

    const component = shallow(<App />);
    expect(component.find('.app').hasClass('app--macos')).toBe(false);
    expect(component.find('.electron-titlebar').length).toBe(0);
  });
});
