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
  NOT_EXISTS: 'NOT_EXISTS',
  NOT: 'NOT',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
};

// List of operator options with labels
export const operatorsAsOptions = [
  [operators.EXACTLY, 'is Exactly'],
  [operators.EXISTS, 'Exists'],
  [operators.NOT_EXISTS, 'Not Exists'],
  [operators.NOT, 'is Not'],
  [operators.GREATER_THAN, 'is Greater Than'],
  [operators.GREATER_THAN_OR_EQUAL, 'is Greater Than or Exactly'],
  [operators.LESS_THAN, 'is Less Than'],
  [operators.LESS_THAN_OR_EQUAL, 'is Less Than or Exactly'],
].map(([value, label]) => ({ value, label }));

// Operators that also require a value to be used
export const operatorsWithValue = new Set([
  operators.EXACTLY,
  operators.NOT,
  operators.GREATER_THAN,
  operators.GREATER_THAN_OR_EQUAL,
  operators.LESS_THAN,
  operators.LESS_THAN_OR_EQUAL,
]);

export const operatorsByType = {
  text: new Set(['EXACTLY', 'NOT']),
  number: new Set(['EXACTLY', 'NOT', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL']),
  boolean: new Set(['EXACTLY']),
  ordinal: new Set(['EXACTLY']),
  categorical: new Set(['EXACTLY']),
  exists: new Set(['EXISTS', 'NOT_EXISTS']), // TODO: Better words for these?
};

export const templates = {
  edgeRule: ['type', 'operator'],
  alterTypeRule: ['type', 'operator'],
  alterVariableRule: ['type', 'operator', 'attribute', 'value'],
  egoRule: ['attribute', 'value'],
};
