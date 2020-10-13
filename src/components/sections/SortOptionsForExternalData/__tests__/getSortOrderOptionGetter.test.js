/* eslint-env jest */

import getSortOrderOptionGetter from '../getSortOrderOptionGetter';

const mockExternalDataPropertyOptions = [
  { label: 'Name', value: '1234-1234-1234-1' },
  { label: 'Age', value: '1234-1234-1234-2' },
  { label: 'Favourite Color', value: '1234-1234-1234-3' },
];

describe('getSortOrderOptionGetter', () => {
  it('options for `property`', () => {
    const sortOrderOptionGetter = getSortOrderOptionGetter(
      mockExternalDataPropertyOptions,
    );

    const mockAllValues = [{ property: '1234-1234-1234-2', direction: 'asc' }];

    const subject = sortOrderOptionGetter('property', undefined, mockAllValues);

    expect(subject).toEqual([
      { label: '*', value: '*' },
      { label: 'Name', value: '1234-1234-1234-1' },
      { label: 'Age', value: '1234-1234-1234-2', disabled: true },
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
