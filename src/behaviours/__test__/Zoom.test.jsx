/* eslint-env jest */

import { shallow } from 'enzyme';

import Zoom from '../Zoom';

const mockProps = {};

describe('<Zoom />', () => {
  it('can render', () => {
    shallow(<Zoom {...mockProps}>Foo</Zoom>);
  });
});
