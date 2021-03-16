import { isEmpty, isNil } from 'lodash';
import { operatorsWithValue } from './options';

const valididateField = (value) => {
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
  fields.every((field) => valididateField(options[field]))
);

const validateRule = (rule) => {
  const options = rule.options || {};

  switch (rule.type) {
    case 'alter': {
      if (Object.prototype.hasOwnProperty.call(options, 'attribute')) {
        if (operatorsWithValue.has(options.operator)) {
          return validateFields(['type', 'attribute', 'operator', 'value'], options);
        }
        return validateFields(['type', 'attribute', 'operator'], options);
      }
      return validateFields(['type', 'operator'], options);
    }
    case 'ego': {
      if (operatorsWithValue.has(options.operator)) {
        return validateFields(['attribute', 'operator', 'value'], options);
      }
      return validateFields(['attribute', 'operator'], options);
    }
    case 'edge':
      return validateFields(['type', 'operator'], options);
    default:
      return false;
  }
};

export default validateRule;
