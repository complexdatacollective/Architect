/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { EditSkipLogic } from '../EditSkipLogic';

const mockProps = {
  draft: {},
  updateStage: () => {},
  updateDraft: () => {},
  rules: {},
  onChange: () => {},
};

describe('<EditForm />', () => {
  it('can render', () => {
    const component = shallow(<EditSkipLogic {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
