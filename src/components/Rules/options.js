/* eslint-disable import/prefer-default-export */

export const validTypes = new Set([
  'text',
  'number',
  'datetime',
  'boolean',
  'categorical',
  'ordinal',
]);

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

export const operatorsWithValue = new Set([
  operators.EXACTLY,
  operators.NOT,
  operators.GREATER_THAN,
  operators.GREATER_THAN_OR_EQUAL,
  operators.LESS_THAN,
  operators.LESS_THAN_OR_EQUAL,
]);

export const operatorsByType = {
  text: new Set(['EXACTLY', 'EXISTS', 'NOT_EXISTS', 'NOT']),
  number: new Set(['EXACTLY', 'EXISTS', 'NOT_EXISTS', 'NOT', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL']),
  boolean: new Set(['EXACTLY', 'EXISTS', 'NOT_EXISTS']),
};
