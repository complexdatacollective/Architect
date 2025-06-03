import {
  get, isEmpty, map, toPairs, isEqual, isUndefined, isNil, isNull, isRegExp,
} from 'lodash';
import { DateTime } from 'luxon';

// Simple function to allow returning a custom message if provided, and
// or defaulting to the default message.
const messageWithDefault = (message, defaultMessage) => {
  if (message) {
    return message;
  }
  return defaultMessage;
};

// Return an array of values given either a collection, an array,
// or a single value
const coerceArray = (value) => {
  if (value instanceof Object) {
    return value.reduce((acc, individual) => ([...acc, individual.value]), []);
  }
  if (value instanceof Array) {
    return value;
  }
  return [];
};

const capitalize = (sentence) => sentence.replace(/^\w/, (firstLetter) => firstLetter.toUpperCase());

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

export const required = (isRequired, message) => (value) => {
  if (!isRequired) {
    return undefined;
  }

  return (hasValue(value) ? undefined : messageWithDefault(message, 'Required'));
};

export const requiredAcceptsZero = (isRequired, message) => (value) => (!isNil(value) && isRequired ? undefined : messageWithDefault(message, 'Required'));

export const requiredAcceptsNull = (isRequired, message) => (value) => (!isUndefined(value) && isRequired ? undefined : messageWithDefault(message, 'Required'));

export const positiveNumber = (_, message) => (value) => (value && Math.sign(value) === -1 ? messageWithDefault(message, 'Number must be positive') : undefined);

export const maxLength = (max, message) => (value) => (!isNull(value) && !isUndefined(value) && value.length > max ? messageWithDefault(message, `Must be ${max} characters or less`) : undefined);
export const minLength = (min, message) => (value) => ((isNull(value) || isUndefined(value)) || value.length < min ? messageWithDefault(message, `Must be ${min} characters or more`) : undefined);

export const minValue = (min, message) => (value) => (!isNull(value) && value < min ? messageWithDefault(message, `Must be at least ${min}`) : undefined);
export const maxValue = (max, message) => (value) => (value && value > max ? messageWithDefault(message, `Must be less than ${max}`) : undefined);

export const minSelected = (min, message) => (value) => (!value || coerceArray(value).length < min ? messageWithDefault(message, `You must choose a minimum of ${min} option(s)`) : undefined);
export const maxSelected = (max, message) => (value) => (!isEmpty(value) && coerceArray(value).length > max ? messageWithDefault(message, `You must choose a maximum of ${max} option(s)`) : undefined);

export const uniqueArrayAttribute = (_, message) => (value, allValues, __, name) => {
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
    return messageWithDefault(message, `${capitalize(attribute)}s must be unique`);
  }
  return undefined;
};

export const uniqueByList = (list = [], message) => (value) => {
  if (!value) { return undefined; }

  const existsAlready = list
    .some((existingValue) => isRoughlyEqual(existingValue, value));

  if (existsAlready) {
    return messageWithDefault(message, `"${value}" is already in use`);
  }

  return undefined;
};

export const ISODate = (dateFormat, message) => (value) => {
  const dt = DateTime.fromISO(value);
  if (
    (value && dateFormat.length !== value.length)
    || (value && !dt.isValid)
  ) {
    return messageWithDefault(message, `Date is not valid (${dateFormat.toUpperCase()})`);
  }
  return undefined;
};

// Variables and option values must respect NMTOKEN rules so that
// they are compatable with XML export formats
export const allowedVariableName = (name = 'variable name') => (value) => {
  if (!/^[a-zA-Z0-9._\-:]+$/.test(value)) {
    return `Not a valid ${name}. Only letters, numbers and the symbols ._-: are supported`;
  }
  return undefined;
};

export const allowedNMToken = allowedVariableName;

export const validRegExp = (_, message) => (value) => {
  try {
    const regexp = new RegExp(value);
    if (isRegExp(regexp)) {
      return undefined;
    }
    return messageWithDefault(message, 'Not a valid regular expression.');
  } catch (e) {
    return messageWithDefault(message, 'Not a valid regular expression.');
  }
};

const validations = {
  ISODate,
  allowedVariableName,
  allowedNMToken,
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
  validRegExp,
};

/**
* Returns the named validation function, if no matching one is found it returns a validation
* which will always fail.
*
* Use with a custom function by passing a function as the object value:
*
* const customValidation = (value) => {
*   return value === 'custom' ? undefined : 'Custom validation failed';
* };
*
* validations.custom = customValidation;
*
* @param {object} validationOptions The protocol config for the validations to return.
  */
export const getValidations = (validationOptions = {}) => map(
  toPairs(validationOptions),
  ([type, options]) => {
    if (typeof options === 'function') { return options; }
    return Object.hasOwnProperty.call(validations, type)
      ? validations[type](options)
      : () => (`Validation "${type}" not found`);
  },
);

export const getValidator = (validation = {}) => {
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
