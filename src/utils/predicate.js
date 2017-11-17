import {
  isEqual,
  isNull,
} from 'lodash';

const operators = [
  'EXACTLY',
  'EXISTS',
  'NOT_EXISTS',
  'NOT',
  'GREATER_THAN',
  'GREATER_THAN_OR_EQUAL',
  'LESS_THAN',
  'LESS_THAN_OR_EQUAL',
];

const predicate = operator =>
  ({ value, other }) => {
    switch (operator) {
      case 'GREATER_THAN':
        return value > other;
      case 'LESS_THAN':
        return value < other;
      case 'GREATER_THAN_OR_EQUAL':
        return value >= other;
      case 'LESS_THAN_OR_EQUAL':
        return value <= other;
      case 'EQUAL':
        return isEqual(value, other);
      case 'NOT':
        return !isEqual(value, other);
      case 'EXISTS':
        return !isNull(value);
      case 'NOT_EXISTS':
        return isNull(value);
      default:
        return false;
    }
  };

export { operators };
export default predicate;
