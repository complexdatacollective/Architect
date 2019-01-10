import { map } from 'lodash';
import { pick } from 'lodash/fp';

const NON_SORTABLE_TYPES = ['layout'];
const getOptionProperties = pick(['label', 'value']);

/**
 * Creates a optionGetter function for <MultiSelect />
 *
 * This optionGetter is for sortOrder, which defines properties for `property` and `direction`
 * columns.
 */
const getSortOrderOptionGetter = variableOptions =>
  (property, rowValues, allValues) => {
    switch (property) {
      case 'property': {
        const used = map(allValues, 'property');

        return [
          { value: '*', label: '*' },
          ...variableOptions,
        ]
          .filter(
            option => !NON_SORTABLE_TYPES.includes(option.type),
          )
          .map(option => (
            !used.includes(option.value) ?
              getOptionProperties(option) :
              { ...getOptionProperties(option), isDisabled: true }
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
