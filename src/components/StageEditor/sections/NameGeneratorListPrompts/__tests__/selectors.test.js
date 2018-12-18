/* eslint-env jest */
import {
  makeGetDataSourcesWithNodeTypeOptions,
  makeGetExternalDataPropertyOptions,
} from '../selectors';


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
        sourceWithMixedNodes: {
          nodes: [
            { type: 'something', attributes: { alpha: 1, bravo: 2 } },
            { type: 'else', attributes: { charlie: 3, bravo: 2 } },
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

describe('NameGeneratorListPrompts selectors', () => {
  describe('getDataSourcesWithNodeTypeOptions()', () => {
    let getDataSourcesWithNodeTypeOptions;

    beforeEach(() => {
      getDataSourcesWithNodeTypeOptions = makeGetDataSourcesWithNodeTypeOptions();
    });

    it('extracts dataSource properties into options list', () => {
      const nodeType = 'something';

      const mockProps = {
        nodeType,
      };

      expect(getDataSourcesWithNodeTypeOptions(mockState, mockProps)).toEqual([
        { value: 'sourceWithMixedNodes', label: 'sourceWithMixedNodes' },
      ]);
    });
  });

  describe('getExternalDataPropertyOptions()', () => {
    let getExternalDataPropertyOptions;

    beforeEach(() => {
      getExternalDataPropertyOptions = makeGetExternalDataPropertyOptions();
    });

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
});
