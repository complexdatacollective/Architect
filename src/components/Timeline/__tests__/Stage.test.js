/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Stage from '../Stage';

jest.mock('../../../utils/CSSVariables');

const mockProps = {
  type: 'Foo',
  onEditStage: () => {},
  onEditSkipLogic: () => {},
};

describe('<Stage />', () => {
  it('can render', () => {
    const component = shallow(<Stage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
