import { get } from 'lodash';

const VALIDATIONS = {
  text: [
    'required',
    'minLength',
    'maxLength',
  ],
  number: [
    'required',
    'minValue',
    'maxValue',
  ],
  datetime: [
    'required',
  ],
  boolean: [
    'required',
  ],
  ordinal: [
    'required',
  ],
  categorical: [
    'required',
    'minSelected',
    'maxSelected',
  ],
};

const VALIDATIONS_WITH_VALUES = [
  'minLength',
  'maxLength',
  'minValue',
  'maxValue',
  'minSelected',
  'maxSelected',
];

const isValidationWithValue = validation =>
  VALIDATIONS_WITH_VALUES.includes(validation);

const getValidationsForVariableType = variableType =>
  get(VALIDATIONS, variableType, []);

const getValidationOptionsForVariableType = variableType =>
  getValidationsForVariableType(variableType)
    .map(validation => ({ label: validation, value: validation }));

export {
  getValidationsForVariableType,
  getValidationOptionsForVariableType,
  isValidationWithValue,
  VALIDATIONS,
};

export default VALIDATIONS;
