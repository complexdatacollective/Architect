/* eslint-disable */
/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { Protocol } from '../Protocol';
import TimelineStage from '../../components/TimelineStage';

const mockProps = {
  stages: [{ type: 'Foo' }],
};

const mockStore = () =>
  createStore(
    () => ({
      protocol: { present: { options: { title: '' } } },
    }),
  );

describe('<Protocol />', () => {
  it('can render', () => {
    const component = shallow(<Protocol {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('intial state', () => {
    const component = shallow(<Protocol {...mockProps} />);
    component.update();
    expect(component.find('NewStage').length).toEqual(0);
  });

  it('Shows add stage screen when new stage is clicked', () => {
    const component = mount(
      <Provider store={mockStore()}>
        <Protocol {...mockProps} store={mockStore()} />
      </Provider>,
    );

    component.find('TimelineAddNew').find('button').first().simulate('click');
    expect(component.find('NewStage').prop('show')).toBe(true);
  });

  it('Shows edit screen when edit skip logic is clicked', () => {
    const component = mount(
      <Provider store={mockStore()}>
        <Protocol {...mockProps} store={mockStore()} />
      </Provider>,
    );

    component.find('TimelineEditSkipLogic').find('button').first().simulate('click');
    expect(component.find('EditSkip').prop('show')).toBe(true);
  });
});
