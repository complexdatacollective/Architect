/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Scaffold from '../../../../utils/tests/Scaffold';
import { ItemEditor } from '../ItemEditor';
import { sizes } from '../sizes';

/*
  numerical sizes for reference (from ../sizes):

  SMALL 1
  MEDIUM 2
  LARGE 4
*/

const mockProps = {
  name: '',
  onComplete: () => {},
};

const optionStates = (options) => {
  const disabledOptionCount = options.reduce(
    (memo, { disabled }) =>
      (disabled ? memo + 1 : memo),
    0,
  );

  return {
    count: options.length,
    disabledOptionCount,
    enabledOptionCount: options.length - disabledOptionCount,
  };
};


describe('<ItemEditor />', () => {
  it('prevents clicks from bubbling', () => {
    const clickDetector = jest.fn();

    const component = mount((
      <Scaffold>
        <div onClick={clickDetector}>
          <ItemEditor {...mockProps} />
        </div>
      </Scaffold>
    ));

    component.find('ItemEditor Button').simulate('click');

    expect(clickDetector.mock.calls.length).toBe(0);
  });

  it('triggers onComplete when button clicked', () => {
    const completeHandler = jest.fn();
    const component = shallow(<ItemEditor {...mockProps} onComplete={completeHandler} />);

    component.find('Button').simulate('click');

    expect(completeHandler.mock.calls.length).toBe(1);
  });

  it('if spare capacity is 0 all options are disabled', () => {
    const component = shallow((
      <ItemEditor
        {...mockProps}
        spareCapacity={0}
        size={null}
      />
    ));

    const optionsResult = optionStates(component.instance().options);

    expect(optionsResult.count).toBe(3);
    expect(optionsResult.disabledOptionCount).toBe(3);
  });

  it('if spare capacity is max, all options are enabled', () => {
    const component = shallow((
      <ItemEditor
        {...mockProps}
        spareCapacity={4}
        size={null}
      />
    ));

    const optionsResult = optionStates(component.instance().options);

    expect(optionsResult.count).toBe(3);
    expect(optionsResult.enabledOptionCount).toBe(3);
  });

  it('all options that will fit are enabled', () => {
    const component = shallow((
      <ItemEditor
        {...mockProps}
        spareCapacity={0}
        size={sizes.MEDIUM}
      />
    ));

    const optionsResult = optionStates(component.instance().options);

    expect(optionsResult.count).toBe(3);
    expect(optionsResult.disabledOptionCount).toBe(1);
  });
});
