/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ItemChooser } from '../ItemChooser';

const mockProps = {
  onChooseItemType: () => {},
};

describe('<ItemChooser />', () => {
  it('triggers onChooseItemType when type is clicked', () => {
    const fakeEvent = { stopPropagation: jest.fn() };
    const chooseItemTypeHandler = jest.fn();
    const component = shallow((
      <ItemChooser {...mockProps} onChooseItemType={chooseItemTypeHandler} />
    ));

    component.find('.content-grid-chooser-item').first().simulate('click', fakeEvent);

    expect(fakeEvent.stopPropagation.mock.calls.length).toBe(1);
    expect(chooseItemTypeHandler.mock.calls.length).toBe(1);
  });
});
