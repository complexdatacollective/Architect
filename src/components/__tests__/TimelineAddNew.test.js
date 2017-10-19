/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import TimelineAddNew from '../TimelineAddNew';

const mockProps = {
  onInsertStage: () => {},
};

describe('<TimelineAddNew />', () => {
  it('can render', () => {
    const component = shallow(<TimelineAddNew {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
