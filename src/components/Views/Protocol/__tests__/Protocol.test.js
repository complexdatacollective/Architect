/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { Protocol } from '../Protocol';

let subject = null;

const mockProps = {
  saveProtocol: () => {},
  exportProtocol: () => {},
  loadProtocol: () => {},
  stages: [{ id: 1, type: 'Foo' }],
  overview: {},
  match: { params: {} },
};

const mockStore = () =>
  createStore(
    () => ({
      protocol: { present: { options: { title: '' } } },
    }),
  );

const makeSubject = () =>
  mount(
    <Provider store={mockStore()}>
      <Protocol {...mockProps} store={mockStore()} />
    </Provider>,
  );

describe('<Protocol />', () => {
  it('can render', () => {
    subject = shallow(<Protocol {...mockProps} />);

    expect(subject).toMatchSnapshot();
  });

  it('intial state', () => {
    subject = shallow(<Protocol {...mockProps} />);
    subject.update();
    expect(subject.find('NewStage').length).toEqual(0);
  });

  describe('Screen change interactions', () => {
    beforeEach(() => {
      subject = makeSubject();
    });

    it('Shows/hides add stage screen');

    it('Shows/hides edit skip logic screen');

    it('Hides add stage screen when screen added');

    it('Hides edit skip logic screen when saving');
  });
});
