/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Item } from '../Item';

const mockProps = {
  fieldId: 'foo',
  onToggleItemEdit: () => {},
  handleDelete: () => {},
  onChooseItemType: () => {},
};

describe('<Item />', () => {
  it('can render', () => {
    const component = shallow(<Item {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('when item.type is empty show chooser', () => {
    const component = shallow(<Item {...mockProps} item={{ type: null }} />);
    const componentWithoutChooser = shallow(<Item {...mockProps} item={{ type: 'text' }} />);

    expect(component.find('ItemChooser').prop('show')).toBe(true);
    expect(componentWithoutChooser.find('ItemChooser').prop('show')).toBe(false);
  });

  it('shows edit/preview correctly', () => {
    const componentWithType = shallow(<Item {...mockProps} item={{ type: 'foo' }} />);
    const componentWithEditor = shallow(<Item {...mockProps} editing="foo" item={{ id: 'foo' }} />);
    const componentWithPreview = shallow(<Item {...mockProps} editing={null} item={{ id: 'foo' }} />);

    expect(componentWithType.find('ItemPreview').exists()).toBe(true);
    expect(componentWithType.find('ItemEditor').prop('show')).toBe(true);

    expect(componentWithEditor.hasClass('content-grid-item--edit')).toBe(true);
    expect(componentWithPreview.hasClass('content-grid-item--edit')).toBe(false);
  });
});
