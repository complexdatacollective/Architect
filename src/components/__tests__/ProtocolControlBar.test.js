/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ProtocolControlBar from '../ProtocolControlBar';
import testState from '../../__tests__/testState.json';

const mockProps = {
  saveProtocol: () => {},
  isSaving: false,
  isDisabled: false,
  showControlBar: true,
  hasUnsavedChanges: false,
  hasAnyStages: true,
  handleClickStart: () => {},
};

const mockStore = createStore(() => testState);

describe('<ProtocolControlBar />', () => {
  it('can render', () => {
    const component = mount(
      <Provider store={mockStore}>
        <ProtocolControlBar {...mockProps} />
      </Provider>,
    );

    expect(component.html()).toMatchSnapshot();
  });
});
