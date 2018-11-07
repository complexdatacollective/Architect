/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { EditStage } from '../EditStage';

const mockProps = {
  dirty: false,
  invalid: false,
  show: true,
  submitForm: () => {},
  onComplete: () => {},
  stage: {},
  updateStage: () => {},
  createStage: () => {},
  previewStage: () => {},
  closePreview: () => {},
};

describe('<EditStage />', () => {
  it('can render', () => {
    const component = shallow(<EditStage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
