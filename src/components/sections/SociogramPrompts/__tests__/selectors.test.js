/* eslint-env jest */

import mockState from '../../../../__tests__/testState.json';
import {
  getLayoutVariablesForSubject,
  getHighlightVariablesForSubject,
  getEdgesForSubject,
} from '../selectors';

jest.mock('redux-form', () => ({
  formValueSelector: () => () => '1234-1234-4',
  getFormValues: () => () => ({}),
}));

const subject = {
  entity: 'node',
  type: '1234-1234-1234',
};
const form = 'edit-prompt';

describe('SociogramPrompts', () => {
  describe('selectors', () => {
    it('get layout variables for node type', () => {
      const result = getLayoutVariablesForSubject(mockState, subject);

      expect(result).toMatchSnapshot();
    });

    it('get highlight variables for node type', () => {
      const result = getHighlightVariablesForSubject(mockState, {
        form,
        ...subject,
        formUsedVariableIndex: ['1234-1234-3'],
      });

      expect(result).toMatchSnapshot();
    });

    it('get edges for node type', () => {
      const result = getEdgesForSubject(mockState, subject);

      expect(result).toMatchSnapshot();
    });

    it('get edge filters', () => {
      const result = getEdgesForSubject(mockState, subject);

      expect(result).toMatchSnapshot();
    });
  });
});
