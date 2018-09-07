import { keys, pickBy, map, toPairs, isUndefined } from 'lodash';

const coerceArray = (value) => {
  if (value instanceof Object) {
    return keys(pickBy(value));
  }
  if (value instanceof Array) {
    return value;
  }
  return [];
};

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

const validations = {
  required,
  requiredAcceptsNull,
  minLength,
  maxLength,
  minValue,
  maxValue,
  minSelected,
  maxSelected,
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
