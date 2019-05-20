import { keys, get, pickBy, map, toPairs, isUndefined } from 'lodash';

const coerceArray = (value) => {
  if (value instanceof Object) {
    return keys(pickBy(value));
  }
  if (value instanceof Array) {
    return value;
  }
  return [];
};

const capitalize = sentence =>
  sentence.replace(/^\w/, firstLetter => firstLetter.toUpperCase());

export const required = () =>
  value =>
    (value ? undefined : 'Required');
export const requiredAcceptsNull = () =>
  value =>
    (!isUndefined(value) ? undefined : 'Required');
export const maxLength = max =>
  value =>
    (value && value.length > max ? `Must be ${max} characters or less` : undefined);
export const minLength = min =>
  value =>
    (value && value.length < min ? `Must be ${min} characters or more` : undefined);
export const minValue = min =>
  value =>
    (value && value < min ? `Must be at least ${min}` : undefined);
export const maxValue = max =>
  value =>
    (value && value > max ? `Must be less than ${max}` : undefined);

export const minSelected = min =>
  value =>
    (!value || coerceArray(value).length < min ? `Must choose ${min} or more` : undefined);

export const maxSelected = max =>
  value =>
    (!value || coerceArray(value).length > max ? `Must choose ${max} or less` : undefined);

export const validateName = (value, allValues, { existingVariableNames = [] }) => {
  const validateRequired = required();
  if (validateRequired(value)) { return validateRequired(value); }

  if (!value) { return undefined; }

  const isUsed = existingVariableNames
    .some(name => name.toLowerCase() === value.toLowerCase());
  if (isUsed) { return `Variable name "${value}" is already used elsewhere`; }

  return undefined;
};

export const uniqueArrayAttribute = () =>
  (value, allValues, formProps, name) => {
    // expects `name` of format: `fieldName[n].attribute`
    const fieldName = name.split('[')[0];
    const attribute = name.split('.')[1];
    const instanceCount = get(allValues, fieldName)
      .reduce((count, option) => {
        if (option[attribute] !== value) { return count; }
        return count + 1;
      }, 0);
    if (!value) { return undefined; }
    if (instanceCount >= 2) {
      return `${capitalize(attribute)}s must be unique`;
    }
    return undefined;
  };

const validations = {
  required,
  requiredAcceptsNull,
  minLength,
  maxLength,
  minValue,
  maxValue,
  minSelected,
  maxSelected,
  validateName,
  uniqueArrayAttribute,
};

/**
* Returns the named validation function, if no matching one is found it returns a validation
* which will always fail.
* @param {object} validationOptions The protocol config for the validations to return.
  */
export const getValidations = validationOptions =>
  map(
    toPairs(validationOptions),
    ([type, options]) => {
      if (typeof options === 'function') { return options; }
      return Object.hasOwnProperty.call(validations, type) ?
        validations[type](options) :
        () => (`Validation "${type}" not found`);
    },
  );

export default validations;
