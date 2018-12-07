/* eslint-env jest */
import { getExternalDataPropertyOptions } from '../selectors';

const mockState = {
  protocol: {
    present: {
      externalData: {
        foo: {
          nodes: [
            { type: 'bar', attributes: { alpha: 1, bravo: 2 } },
            { type: 'bar', attributes: { charlie: 3, bravo: 2 } },
          ],
        },
      },
      variableRegistry: {
        node: {
          bar: {
            variables: {
              alpha: { name: 'ALPHA' },
              bravo: { name: 'BRAVO' },
              charlie: { name: 'CHARLIE' },
            },
          },
        },
      },
    },
  },
};


describe('getExternalDataPropertyOptions()', () => {
  it('extracts dataSource properties into options list', () => {
    const dataSource = 'foo';
    const nodeType = 'bar';

    const mockProps = {
      dataSource,
      nodeType,
    };

    expect(getExternalDataPropertyOptions(mockState, mockProps)).toEqual([
      { value: 'alpha', label: 'ALPHA' },
      { value: 'bravo', label: 'BRAVO' },
      { value: 'charlie', label: 'CHARLIE' },
    ]);
  });
});
