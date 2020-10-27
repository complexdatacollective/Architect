/* eslint-env jest */

import React from 'react';
import uuid from 'uuid';
import { shallow } from 'enzyme';
import { Stage } from '../Stage';

jest.mock('@codaco/ui/lib/utils/CSSVariables');

const mockProps = {
  id: uuid(),
  stageNumber: 1,
  type: 'Foo',
  onEditStage: () => {},
  onDeleteStage: () => {},
  onEditSkipLogic: () => {},
  onInsertStage: () => {},
};

describe('<Stage />', () => {
  it('can render', () => {
    const component = shallow(<Stage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
