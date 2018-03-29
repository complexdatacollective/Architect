/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import AddNew from '../AddNew';

jest.mock('../../../utils/CSSVariables');

const mockProps = {
  onInsertStage: () => {},
};

describe('<AddNew />', () => {
  it('can render', () => {
    const component = shallow(<AddNew {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
