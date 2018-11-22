import { map } from 'lodash';

/**
 * Creates a optionGetter function for <MultiSelect />
 *
 * This optionGetter is for externalProperties, which defines properties for the `variable` column.
 */
const getExternalPropertiesOptionGetter = externalDataPropertyOptions =>
  (property, rowValues, allValues) => {
    const used = map(allValues, 'variable');

    return externalDataPropertyOptions
      .map(
        option => (!used.includes(option.value) ? option : { ...option, isDisabled: true }),
      );
  };

/**
 * Creates a optionGetter function for <MultiSelect />
 *
 * This optionGetter is for sortOrder, which defines properties for `property` and `direction`
 * columns.
 */
const getSortOrderOptionGetter = externalDataPropertyOptions =>
  (property, rowValues, allValues) => {
    switch (property) {
      case 'property': {
        const used = map(allValues, 'property');

        return externalDataPropertyOptions
          .map(
            option => (!used.includes(option.value) ? option : { ...option, isDisabled: true }),
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

const optionGetters = {
  getExternalPropertiesOptionGetter,
  getSortOrderOptionGetter,
};

export {
  getExternalPropertiesOptionGetter,
  getSortOrderOptionGetter,
};

export default optionGetters;
