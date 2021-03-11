import { map } from 'lodash';

const NON_SORTABLE_TYPES = ['layout'];
const getOptionProperties = (option) => ({
  value: option.value,
  label: option.label,
});

/**
 * Creates a optionGetter function for <MultiSelect />
 *
 * This optionGetter is for sortOrder, which defines properties for `property` and `direction`
 * columns.
 */
const getSortOrderOptionGetter = (variableOptions) => (property, rowValues, allValues) => {
  switch (property) {
    case 'property': {
      const used = map(allValues, 'property');

      return [
        { value: '*', label: '*' },
        ...variableOptions,
      ]
        .filter(
          (option) => !NON_SORTABLE_TYPES.includes(option.type),
        )
        .map((option) => (
          !used.includes(option.value)
            ? getOptionProperties(option)
            : { ...getOptionProperties(option), disabled: true }
        ));
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

const optionGetters = {
  getSortOrderOptionGetter,
};

export {
  getSortOrderOptionGetter,
};

export default optionGetters;
