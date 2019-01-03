import { isEmpty } from 'lodash';
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
    default:
      throw Error(`Could not validate unknown type "${type}"`);
  }
};

const validateFields = (fields = [], options = {}) =>
  fields.every(field => valididateField(options[field]));

const validateRule = (rule) => {
  const options = rule.options || {};

  switch (rule.type) {
    case 'alter': {
      if (Object.prototype.hasOwnProperty.call(options, 'variable')) {
        if (operatorsWithValue.has(options.operator)) {
          return validateFields(['type', 'variable', 'operator', 'value'], options);
        }
        return validateFields(['type', 'variable', 'operator'], options);
      }
      return validateFields(['type', 'operator'], options);
    }
    case 'ego': {
      if (operatorsWithValue.has(options.operator)) {
        return validateFields(['variable', 'operator', 'value'], options);
      }
      return validateFields(['variable', 'operator'], options);
    }
    case 'edge':
      return validateFields(['type', 'operator'], options);
    default:
      return false;
  }
};

export default validateRule;
