/* eslint-env jest */
import {
  getNetworkOptions,
  makeGetExternalDataPropertyOptions,
} from '../selectors';


const mockState = {
  protocol: {
    present: {
      assetManifest: {
        foo: {
          type: 'network',
          name: 'My Network',
          source: 'myNetwork.json',
        },
        bar: {
          type: 'image',
          name: 'An Image',
          source: 'anImage.jpg',
        },
      },
      variableRegistry: {
        node: {
          bar: {
            variables: {
              alpha: { name: 'ALPHA', type: 'text' },
              bravo: { name: 'BRAVO', type: 'text' },
              charlie: { name: 'CHARLIE', type: 'location' },
            },
          },
        },
      },
    },
  },
};

describe('NameGeneratorListPrompts selectors', () => {
  describe('getNetworkOptions()', () => {
    it('extracts assetManifest networks into options list', () => {
      expect(getNetworkOptions(mockState)).toEqual([
        { value: 'foo', label: 'My Network' },
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
        // We filter certain types of variable:
        // { value: 'charlie', label: 'CHARLIE' },
      ]);
    });
  });
});
