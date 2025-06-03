import { map } from 'lodash';

const NON_SORTABLE_TYPES = ['layout'];

/**
 * Creates a optionGetter function for <MultiSelect />
 *
 * This optionGetter is for sortOrder, which defines properties for `property` and `direction`
 * columns.
 */
const getSortOrderOptionGetter = (
  externalDataPropertyOptions,
) => (property, rowValues, allValues) => {
  switch (property) {
    case 'property': {
      const used = map(allValues, 'property');

      return [
        { value: '*', label: '*' },
        ...externalDataPropertyOptions,
      ]
        .filter(
          (option) => !NON_SORTABLE_TYPES.includes(option.value),
        )
        .map(
          (option) => (!used.includes(option.value) ? option : { ...option, disabled: true }),
        );
    }
    case 'direction':
      return [
        { value: 'desc', label: 'Descending' },
        { value: 'asc', label: 'Ascending' },
      ];
    default:
      return [];
  }
};

export default getSortOrderOptionGetter;
