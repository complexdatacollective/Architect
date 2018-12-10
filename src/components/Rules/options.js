/* eslint-disable import/prefer-default-export */

export const validTypes = new Set([
  'text',
  'number',
  'datetime',
  'boolean',
  'categorical',
  'ordinal',
]);

export const operators = [
  ['EXACTLY', 'is Exactly'],
  ['EXISTS', 'Exists'],
  ['NOT_EXISTS', 'Not Exists'],
  ['NOT', 'is Not'],
  ['GREATER_THAN', 'is Greater Than'],
  ['GREATER_THAN_OR_EQUAL', 'is Greater Than or Exactly'],
  ['LESS_THAN', 'is Less Than'],
  ['LESS_THAN_OR_EQUAL', 'is Less Than or Exactly'],
].map(([value, label]) => ({ value, label }));

export const operatorsByType = {
  text: new Set(['EXACTLY', 'EXISTS', 'NOT_EXISTS', 'NOT']),
  number: new Set(['EXACTLY', 'EXISTS', 'NOT_EXISTS', 'NOT', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL']),
  boolean: new Set(['EXACTLY', 'EXISTS', 'NOT_EXISTS']),
};
