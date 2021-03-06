/* eslint-env jest */

import {
  getSortOrderOptionGetter,
} from '../optionGetters';

const mockVariableOptions = [
  { label: 'Name', type: 'text', value: '1234-1234-1234-1' },
  { label: 'Age', type: 'number', value: '1234-1234-1234-2' },
  { label: 'Location', type: 'layout', value: '1234-1234-1234-3' },
];

describe('CategoricalBin optionGetters', () => {
  describe('getSortOrderOptionGetter', () => {
    it('options for `property`', () => {
      const sortOrderOptionGetter = getSortOrderOptionGetter(
        mockVariableOptions,
      );

      const mockAllValues = [{
        property: '1234-1234-1234-2',
        direction: 'asc',
      }];

      const subject = sortOrderOptionGetter('property', undefined, mockAllValues);

      expect(subject).toEqual([
        { label: '*', value: '*' },
        { label: 'Name', value: '1234-1234-1234-1' },
        { label: 'Age', value: '1234-1234-1234-2', disabled: true },
      ]);
    });

    it('options for `direction`', () => {
      const sortOrderOptionGetter = getSortOrderOptionGetter(
        mockVariableOptions,
      );

      const mockAllValues = [{ property: '1234-1234-1234-2', direction: 'asc' }];

      const subject = sortOrderOptionGetter('direction', undefined, mockAllValues);

      expect(subject).toEqual([
        { label: 'Descending', value: 'desc' },
        { label: 'Ascending', value: 'asc' },
      ]);
    });
  });
});
