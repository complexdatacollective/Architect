/* eslint-disable import/prefer-default-export */

// Variable types that can be used in rules
export const validTypes = new Set([
  'text',
  'number',
  'datetime',
  'boolean',
  'categorical',
  'ordinal',
]);

// List of operators
export const operators = {
  EXACTLY: 'EXACTLY',
  EXISTS: 'EXISTS',
  INCLUDES: 'INCLUDES',
  EXCLUDES: 'EXCLUDES',
  NOT_EXISTS: 'NOT_EXISTS',
  NOT: 'NOT',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
};

// List of operator options with labels
export const operatorsAsOptions = [
  [operators.EXACTLY, 'is exactly'],
  [operators.EXISTS, 'exists'],
  [operators.NOT_EXISTS, 'does not Exist'],
  [operators.NOT, 'is not'],
  [operators.GREATER_THAN, 'is greater than'],
  [operators.GREATER_THAN_OR_EQUAL, 'is greater than or exactly'],
  [operators.LESS_THAN, 'is less than'],
  [operators.LESS_THAN_OR_EQUAL, 'is less than or exactly'],
  [operators.INCLUDES, 'includes'],
  [operators.EXCLUDES, 'excludes'],
].map(([value, label]) => ({ value, label }));

// Operators that also require a value to be used
export const operatorsWithValue = new Set([
  operators.EXACTLY,
  operators.NOT,
  operators.GREATER_THAN,
  operators.GREATER_THAN_OR_EQUAL,
  operators.LESS_THAN,
  operators.LESS_THAN_OR_EQUAL,
  operators.INCLUDES,
  operators.EXCLUDES,
]);

export const operatorsByType = {
  text: new Set(['EXACTLY', 'NOT']),
  number: new Set(['EXACTLY', 'NOT', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL']),
  boolean: new Set(['EXACTLY']),
  ordinal: new Set(['EXACTLY', 'NOT']),
  categorical: new Set(['INCLUDES', 'EXCLUDES']),
  exists: new Set(['EXISTS', 'NOT_EXISTS']), // TODO: Better words for these?
};

export const templates = {
  edgeRule: ['type', 'operator'],
  alterTypeRule: ['type', 'operator'],
  alterVariableRule: ['type', 'operator', 'attribute', 'value'],
  egoRule: ['attribute', 'value'],
};
