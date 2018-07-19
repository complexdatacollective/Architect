/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import TypeEditor from '../TypeEditor';

const mockProps = {
  dirty: false,
  valid: true,
  handleSubmit: () => {},
  displayVariables: [],
  form: 'TYPE_EDITOR',
  toggleCodeView: () => {},
  showCodeView: true,
};

describe('<TypeEditor />', () => {
  it('can render', () => {
    const subject = shallow(<TypeEditor {...mockProps} />);
    expect(subject).toMatchSnapshot();
  });
});
