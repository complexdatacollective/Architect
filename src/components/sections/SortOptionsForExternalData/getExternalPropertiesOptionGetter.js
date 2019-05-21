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

export default getExternalPropertiesOptionGetter;
