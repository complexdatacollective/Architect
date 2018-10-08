/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Timeline } from '../Timeline';

const mockProps = {
  deleteStage: () => {},
  goTo: () => {},
  openDialog: () => {},
};

describe('<Timeline />', () => {
  it('can render', () => {
    const component = shallow(<Timeline {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders stages', () => {
    const mockStages = [{ id: 1, type: 'NameGenerator' }, { id: 2, type: 'Sociogram' }];

    const component = shallow(<Timeline {...mockProps} stages={mockStages} />);

    expect(component.find('sortableElement(Stage)').length).toEqual(2);
  });
});
