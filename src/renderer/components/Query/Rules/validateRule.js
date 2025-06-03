import { isArray, isEmpty, isNil } from 'lodash';
import { operatorsWithValue, operatorsWithOptionCount } from './options';

const validateField = (value) => {
  if (isArray(value)) {
    return value.length > 0;
  }
  const type = typeof value;
  switch (type) {
    case 'string':
      return !isEmpty(value);
    case 'boolean':
      return true;
    case 'number':
      return true;
    case 'undefined':
      return false;
    default:
      return !isNil(value);
  }
};

const validateFields = (fields = [], options = {}) => (
  fields.every((field) => validateField(options[field]))
);

const validateRule = (rule) => {
  const options = rule.options || {};

  switch (rule.type) {
    case 'alter': {
      if (Object.prototype.hasOwnProperty.call(options, 'attribute')) {
        if (operatorsWithValue.has(options.operator)
            || operatorsWithOptionCount.has(options.operator)) {
          return validateFields(['type', 'attribute', 'operator', 'value'], options);
        }
        return validateFields(['type', 'attribute', 'operator'], options);
      }
      return validateFields(['type', 'operator'], options);
    }
    case 'ego': {
      if (operatorsWithValue.has(options.operator)
          || operatorsWithOptionCount.has(options.operator)) {
        return validateFields(['attribute', 'operator', 'value'], options);
      }
      return validateFields(['attribute', 'operator'], options);
    }
    case 'edge':
      if (Object.prototype.hasOwnProperty.call(options, 'attribute')) {
        if (operatorsWithValue.has(options.operator)
            || operatorsWithOptionCount.has(options.operator)) {
          return validateFields(['type', 'attribute', 'operator', 'value'], options);
        }
        return validateFields(['type', 'attribute', 'operator'], options);
      }
      return validateFields(['type', 'operator'], options);
    default:
      return false;
  }
};

export default validateRule;
