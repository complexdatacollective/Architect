/* eslint-disable */
/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { Protocol } from '../Protocol';

const mockProps = {
  stages: [],
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

  it('onInsertStage()', () => {
    // const component = mount(
    //   <Provider store={mockStore()}>
    //     <Protocol {...mockProps} store={mockStore()} />
    //   </Provider>,
    // );

    // component.find(Protocol).instance().onInsertStage(0);
    // component.update();
    // expect(component.find('NewStage').closest('CardTransition').prop('in')).toBe(true);
  });
});
