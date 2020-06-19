import { keys, get, pickBy, map, toPairs, isEqual, isUndefined, isNil } from 'lodash';
import { DateTime } from 'luxon';

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

const hasValue = (value) => {
  if (typeof value === 'string') {
    return !!value;
  }

  return !isNil(value);
};

const isRoughlyEqual = (left, right) => {
  if (typeof left === 'string' && typeof right === 'string') {
    return left.toLowerCase() === right.toLowerCase();
  }

  return isEqual(left, right);
};

export const required = isRequired =>
  (value) => {
    if (!isRequired) {
      return undefined;
    }

    return (hasValue(value) ? undefined : 'Required');
  };

export const requiredAcceptsZero = () =>
  value =>
    (!isNil(value) ? undefined : 'Required');

export const requiredAcceptsNull = () =>
  value =>
    (!isUndefined(value) ? undefined : 'Required');

export const positiveNumber = () =>
  value =>
    (value && Math.sign(value) === -1 ? 'Number must be positive' : undefined);

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

export const uniqueArrayAttribute = () =>
  (value, allValues, formProps, name) => {
    if (!value) { return undefined; }

    // expects `name` of format: `fieldName[n].attribute`
    const fieldName = name.split('[')[0];
    const attribute = name.split('.')[1];
    const instanceCount = get(allValues, fieldName)
      .reduce((count, option) => {
        const optionValue = option[attribute];

        if (isRoughlyEqual(optionValue, value)) {
          return count + 1;
        }
        return count;
      }, 0);

    if (instanceCount >= 2) {
      return `${capitalize(attribute)}s must be unique`;
    }
    return undefined;
  };

export const uniqueByList = (list = []) =>
  (value) => {
    if (!value) { return undefined; }

    const existsAlready = list
      .some(existingValue => isRoughlyEqual(existingValue, value));

    if (existsAlready) {
      return `"${value}" is already used elsewhere`;
    }

    return undefined;
  };

export const ISODate = dateFormat =>
  (value) => {
    const dt = DateTime.fromISO(value);
    if (
      (value && dateFormat.length !== value.length) ||
      (value && !dt.isValid)
    ) {
      return `Date is not valid (${dateFormat.toUpperCase()})`;
    }
    return undefined;
  };

// Variables and option values must respect NMTOKEN rules so that
// they are compatable with XML export formats
export const allowedVariableName = (name = 'variable name') =>
  (value) => {
    if (!/^[a-zA-Z0-9._\-:]+$/.test(value)) {
      return `Not a valid ${name}. Only letters, numbers and the symbols ._-: are supported.`;
    }
    return undefined;
  };

const validations = {
  ISODate,
  allowedVariableName,
  maxLength,
  maxSelected,
  maxValue,
  minLength,
  minSelected,
  minValue,
  positiveNumber,
  required,
  requiredAcceptsNull,
  requiredAcceptsZero,
  uniqueArrayAttribute,
  uniqueByList,
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

export const getValidator = (validation = []) => {
  const validators = getValidations(validation);

  return (value) => {
    const errors = validators.reduce((result, validator) => {
      if (!validator(value) || result) { return result; }

      return validator(value);
    }, undefined);

    return errors;
  };
};

export default validations;
