/* eslint-env jest */

import {
  getExternalPropertiesOptionGetter,
  getSortOrderOptionGetter,
} from '../optionGetters';

const mockExternalDataPropertyOptions = [
  { label: 'Name', value: '1234-1234-1234-1' },
  { label: 'Age', value: '1234-1234-1234-2' },
  { label: 'Favourite Color', value: '1234-1234-1234-3' },
];

describe('optionGetters', () => {
  describe('getExternalPropertiesOptionGetter()', () => {
    it('options for `variable`', () => {
      const externalPropertiesOptionGetter = getExternalPropertiesOptionGetter(
        mockExternalDataPropertyOptions,
      );
      const mockAllValues = [{ variable: '1234-1234-1234-3', value: 'Black' }];

      const subject = externalPropertiesOptionGetter('variable', undefined, mockAllValues);

      expect(subject).toEqual([
        { label: 'Name', value: '1234-1234-1234-1' },
        { label: 'Age', value: '1234-1234-1234-2' },
        { label: 'Favourite Color', value: '1234-1234-1234-3', isDisabled: true },
      ]);
    });
  });

  describe('getSortOrderOptionGetter', () => {
    it('options for `property`', () => {
      const sortOrderOptionGetter = getSortOrderOptionGetter(
        mockExternalDataPropertyOptions,
      );

      const mockAllValues = [{ property: '1234-1234-1234-2', direction: 'asc' }];

      const subject = sortOrderOptionGetter('property', undefined, mockAllValues);

      expect(subject).toEqual([
        { label: 'Name', value: '1234-1234-1234-1' },
        { label: 'Age', value: '1234-1234-1234-2', isDisabled: true },
        { label: 'Favourite Color', value: '1234-1234-1234-3' },
      ]);
    });

    it('options for `direction`', () => {
      const sortOrderOptionGetter = getSortOrderOptionGetter(
        mockExternalDataPropertyOptions,
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
