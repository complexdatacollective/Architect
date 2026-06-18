/* eslint-env jest */

import { shallow } from 'enzyme';
import { createStore } from 'redux';

import CodebookScreen from '../CodebookScreen';

const mockState = {
  protocol: {
    present: {
      stages: [],
    },
  },
};

const mockProps = {
  store: createStore(() => mockState),
};

describe('<CodebookScreen />', () => {
  it('can render', () => {
    const component = shallow(<CodebookScreen {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
