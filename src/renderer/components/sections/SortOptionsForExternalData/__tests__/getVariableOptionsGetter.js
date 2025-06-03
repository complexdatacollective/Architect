/* eslint-env jest */

import getVariableOptionsGetter from '../getVariableOptionsGetter';

const mockExternalDataPropertyOptions = [
  { label: 'Name', value: '1234-1234-1234-1' },
  { label: 'Age', value: '1234-1234-1234-2' },
  { label: 'Favourite Color', value: '1234-1234-1234-3' },
];

describe('getVariableOptionsGetter()', () => {
  it('options for `variable`', () => {
    const externalPropertiesOptionGetter = getVariableOptionsGetter(
      mockExternalDataPropertyOptions,
    );
    const mockAllValues = [{ variable: '1234-1234-1234-3', value: 'Black' }];

    const subject = externalPropertiesOptionGetter('variable', undefined, mockAllValues);

    expect(subject).toEqual([
      { label: 'Name', value: '1234-1234-1234-1' },
      { label: 'Age', value: '1234-1234-1234-2' },
      { label: 'Favourite Color', value: '1234-1234-1234-3', disabled: true },
    ]);
  });
});
