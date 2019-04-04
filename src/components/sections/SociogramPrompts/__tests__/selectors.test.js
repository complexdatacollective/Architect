/* eslint-env jest */

import mockState from '../../../../__tests__/testState.json';

import {
  getLayoutVariablesForNodeType,
  getHighlightVariablesForNodeType,
  getEdgesForNodeType,
} from '../selectors';

jest.mock('redux-form', () => ({
  formValueSelector: () =>
    () => '1234-1234-4',
}));

const nodeType = '1234-1234-1234';
const form = 'edit-prompt';

describe('SociogramPrompts', () => {
  describe('selectors', () => {
    it('get layout variables for node type', () => {
      const result = getLayoutVariablesForNodeType(mockState, { nodeType });

      expect(result).toMatchSnapshot();
    });

    it('get highlight variables for node type', () => {
      const result = getHighlightVariablesForNodeType(mockState, {
        form,
        nodeType,
        formUsedVariableIndex: ['1234-1234-3'],
      });

      expect(result).toMatchSnapshot();
    });

    it('get edges for node type', () => {
      const result = getEdgesForNodeType(mockState, { nodeType });

      expect(result).toMatchSnapshot();
    });
  });
});
