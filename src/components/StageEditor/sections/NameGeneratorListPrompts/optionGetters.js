import { map } from 'lodash';

/**
 * Creates a optionGetter function, `f(property, rowValues, allValues)`, which returns a list of
 * options depending on the value of `property`, `rowValues`, `allValues`.
 */
export const getExternalPropertiesOptionGetter = externalDataPropertyOptions =>
  (property, rowValues, allValues) => {
    const used = map(allValues, 'variable');

    return externalDataPropertyOptions
      .map(
        option => (!used.includes(option.value) ? option : { ...option, isDisabled: true }),
      );
  };

/**
 * Creates a optionGetter function, `f(property, rowValues, allValues)`, which returns a list of
 * options depending on the value of `property`, `rowValues`, `allValues`.
 *
 * This optionGetter is for additionalProperties, and removes the item being used as the
 * displayLabel.
 */
export const getAdditionalPropertiesOptionGetter = (externalDataPropertyOptions, displayLabel) => {
  const externalPropertiesOptionGetter = getExternalPropertiesOptionGetter(
    externalDataPropertyOptions,
  );

  return (property, rowValues, allValues) =>
    externalPropertiesOptionGetter(property, rowValues, allValues)
      .filter(({ value }) => value !== displayLabel);
};

/**
 * Creates a optionGetter function, `f(property, rowValues, allValues)`, which returns a list of
 * options depending on the value of `property`, `rowValues`, `allValues`
 *
 * This optionGetter is for sortOrder, and also defines value for a secondary direction property.
 */
export const getSortOrderOptionGetter = (externalDataPropertyOptions) => {
  const externalPropertiesOptionGetter = getExternalPropertiesOptionGetter(
    externalDataPropertyOptions,
  );

  return (property, rowValues, allValues) => {
    switch (property) {
      case 'property':
        return externalPropertiesOptionGetter(property, rowValues, allValues);
      case 'direction':
        return [
          { value: 'desc', label: 'Descending' },
          { value: 'asc', label: 'Ascending' },
        ];
      default:
        return [];
    }
  };
};
