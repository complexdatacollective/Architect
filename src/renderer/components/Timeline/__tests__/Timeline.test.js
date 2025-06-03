/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Timeline } from '../Timeline';

const mockProps = {
  deleteStage: () => {},
  openDialog: () => {},
  openScreen: () => {},
  locus: 0,
};

describe('<Timeline />', () => {
  it('renders stages', () => {
    const mockStages = [{ id: 1, type: 'NameGenerator' }, { id: 2, type: 'Sociogram' }];

    const component = shallow(<Timeline {...mockProps} stages={mockStages} />);

    expect(component.find('sortableElement(Stage)').length).toEqual(2);
  });
});
