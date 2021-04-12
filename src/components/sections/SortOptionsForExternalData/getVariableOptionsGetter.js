import { map } from 'lodash';

/**
 * Creates a optionGetter function for <MultiSelect />
 *
 * This optionGetter is for variableOptions, which defines properties for the `variable` column.
 */
const getVariableOptionsGetter = (variableOptions) => (property, rowValues, allValues) => {
  const used = map(allValues, 'variable');

  return variableOptions
    .map(
      (option) => (!used.includes(option.value) ? option : { ...option, disabled: true }),
    );
};

export default getVariableOptionsGetter;
