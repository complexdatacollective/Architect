/* eslint-env jest */

import getExternalPropertiesOptionGetter from '../getExternalPropertiesOptionGetter';

const mockExternalDataPropertyOptions = [
  { label: 'Name', value: '1234-1234-1234-1' },
  { label: 'Age', value: '1234-1234-1234-2' },
  { label: 'Favourite Color', value: '1234-1234-1234-3' },
];

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
