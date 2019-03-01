/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { StageEditorScreen } from '../StageEditorScreen';

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

describe('<StageEditorScreen />', () => {
  it('can render', () => {
    const component = shallow(<StageEditorScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('hides preview button when form is invalid', () => {
    const component = shallow(<StageEditorScreen {...mockProps} invalid />);

    expect(
      component.prop('secondaryButtons')
        .find(({ key }) => key === 'preview')
        .props.disabled,
    ).toBe(true);
  });
});
