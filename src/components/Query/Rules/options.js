/* eslint-disable import/prefer-default-export */
import { omit } from 'lodash';
import { VARIABLE_TYPES } from '../../../config/variables';

// Variable types that can't be used in rules
const disallowedVariableTypes = ['scalar', 'layout'];

export const validTypes = new Set(Object.keys(omit(VARIABLE_TYPES, disallowedVariableTypes)));

// Todo: commented out options below to be reinstated when we switch to schema 8

// List of operators
export const operators = {
  EXACTLY: 'EXACTLY',
  EXISTS: 'EXISTS',
  INCLUDES: 'INCLUDES',
  EXCLUDES: 'EXCLUDES',
  // CONTAINS: 'CONTAINS',
  // DOES_NOT_CONTAIN: 'DOES_NOT_CONTAIN',
  NOT_EXISTS: 'NOT_EXISTS',
  NOT: 'NOT',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
  OPTIONS_GREATER_THAN: 'OPTIONS_GREATER_THAN',
  OPTIONS_LESS_THAN: 'OPTIONS_LESS_THAN',
  OPTIONS_EQUALS: 'OPTIONS_EQUALS',
  OPTIONS_NOT_EQUALS: 'OPTIONS_NOT_EQUALS',
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
  // [operators.CONTAINS, 'contains'],
  // [operators.DOES_NOT_CONTAIN, 'does not contain'],
  [operators.INCLUDES, 'includes'],
  [operators.EXCLUDES, 'excludes'],
  [operators.OPTIONS_GREATER_THAN, 'number of selected options is greater than'],
  [operators.OPTIONS_LESS_THAN, 'number of selected options is less than'],
  [operators.OPTIONS_EQUALS, 'number of selected options is exactly'],
  [operators.OPTIONS_NOT_EQUALS, 'number of selected options is not'],
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

// export const operatorsWithRegExp = new Set([
//   operators.CONTAINS,
//   operators.DOES_NOT_CONTAIN,
// ]);

// Operators that also require a count of options
export const operatorsWithOptionCount = new Set([
  operators.OPTIONS_GREATER_THAN,
  operators.OPTIONS_LESS_THAN,
  operators.OPTIONS_EQUALS,
  operators.OPTIONS_NOT_EQUALS,
]);

export const operatorsByType = {
  text: new Set([
    'EXACTLY',
    'NOT',
    // 'CONTAINS',
    // 'DOES_NOT_CONTAIN',
  ]),
  number: new Set(['EXACTLY', 'NOT', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL']),
  boolean: new Set(['EXACTLY', 'NOT']),
  ordinal: new Set(['EXACTLY', 'NOT', 'INCLUDES', 'EXCLUDES']),
  categorical: new Set(['EXACTLY', 'NOT', 'INCLUDES', 'EXCLUDES', 'OPTIONS_GREATER_THAN', 'OPTIONS_LESS_THAN', 'OPTIONS_EQUALS', 'OPTIONS_NOT_EQUALS']),
  exists: new Set(['EXISTS', 'NOT_EXISTS']),
};

export const templates = {
  entityTypeRule: ['type', 'operator'],
  entityVariableRule: ['type', 'operator', 'attribute', 'value'],
  egoRule: ['attribute', 'value'],
};
