import { isEmpty } from 'lodash';
import { operatorsWithValue } from './options';

const validateFields = (fields = [], options = {}) =>
  fields.every(field => !isEmpty(options[field]));

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
    case 'ego':
      return validateFields(['variable', 'operator', 'value'], options);
    case 'edge':
      return validateFields(['type', 'operator'], options);
    default:
      return false;
  }
};

export default validateRule;
