/* eslint-env jest */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Mock redux-form's getFormValues to return a selector function
vi.mock('redux-form', () => ({
  getFormValues: (formName) => (state) => state.form?.[formName]?.values || {},
}));

// Mock react-dom's createPortal to render children directly for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children) => children,
  };
});

import CodeView from '../CodeView';

const mockProps = {
  toggleCodeView: vi.fn(),
  form: 'test',
};

// Create a store with form state
const createMockStore = (formValues = { name: 'example name' }) => createStore(() => ({
  form: {
    test: {
      values: formValues,
    },
  },
}));

describe('<CodeView />', () => {
  let portalRoot;

  beforeEach(() => {
    // Create a portal root for the component
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Clean up portal root
    if (portalRoot && portalRoot.parentNode) {
      portalRoot.parentNode.removeChild(portalRoot);
    }
  });

  it('can render', () => {
    const mockStore = createMockStore();
    const subject = mount((
      <Provider store={mockStore}>
        <CodeView {...mockProps} />
      </Provider>
    ));

    expect(subject.find('.code-view').exists()).toBe(true);
    expect(subject.find('.code-view__controls').text()).toBe('Close code view');
  });

  it('renders content only when show is true', () => {
    const mockStore = createMockStore({ name: 'example name', foo: 'bar' });
    const subject = mount((
      <Provider store={mockStore}>
        <CodeView {...mockProps} show />
      </Provider>
    ));

    expect(subject.find('.code-view').exists()).toBe(true);
    // When show is true, the code block should contain the JSON
    const codeContent = subject.find('code').text();
    expect(codeContent).toContain('example name');
  });

  it('does not render code content when show is false', () => {
    const mockStore = createMockStore({ name: 'example name' });
    const subject = mount((
      <Provider store={mockStore}>
        <CodeView {...mockProps} show={false} />
      </Provider>
    ));

    // When show is false, the code block should be empty
    const codeContent = subject.find('code').text();
    expect(codeContent).toBe('');
  });
});
