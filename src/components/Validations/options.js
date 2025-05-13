import { get, without } from 'lodash';

// Todo: reinstate the commented out validations when we switch to schema 8
const VALIDATIONS = {
  text: [
    'required',
    'minLength',
    'maxLength',
    'unique',
    'differentFrom',
    'sameAs',
    // 'lessThanVariable',
    // 'greaterThanVariable',
  ],
  number: [
    'required',
    'minValue',
    'maxValue',
    'unique',
    'differentFrom',
    'sameAs',
    // 'lessThanVariable',
    // 'greaterThanVariable',
  ],
  datetime: [
    'required',
    'unique',
    'differentFrom',
    'sameAs',
    // 'lessThanVariable',
    // 'greaterThanVariable',
  ],
  scalar: [
    'required',
    'unique',
    'differentFrom',
    'sameAs',
    // 'lessThanVariable',
    // 'greaterThanVariable',
  ],
  boolean: [
    'required',
    'unique',
    'differentFrom',
    'sameAs',
  ],
  ordinal: [
    'required',
    'unique',
    'differentFrom',
    'sameAs',
    // 'lessThanVariable',
    // 'greaterThanVariable',
  ],
  categorical: [
    'required',
    'minSelected',
    'maxSelected',
    'unique',
    'differentFrom',
    'sameAs',
  ],
  passphrase: [
    'minLength',
    'maxLength',
  ],
};

const VALIDATIONS_WITH_NUMBER_VALUES = [
  'minLength',
  'maxLength',
  'minValue',
  'maxValue',
  'minSelected',
  'maxSelected',
];

const VALIDATIONS_WITH_LIST_VALUES = [
  'differentFrom',
  'sameAs',
  // 'lessThanVariable',
  // 'greaterThanVariable',
];

const VALIDATIONS_WITHOUT_VALUES = [
  'required',
  'unique',
];

const isValidationWithoutValue = (validation) => VALIDATIONS_WITHOUT_VALUES.includes(validation);

const isValidationWithNumberValue = (validation) => (
  VALIDATIONS_WITH_NUMBER_VALUES.includes(validation));
const isValidationWithListValue = (validation) => VALIDATIONS_WITH_LIST_VALUES.includes(validation);

const getValidationsForVariableType = (variableType) => get(VALIDATIONS, variableType, []);

const getValidationsForEntity = (validations, entity) => (entity === 'ego' ? without(validations, 'unique') : validations);

const getValidationOptionsForVariableType = (
  variableType,
  entity,
) => getValidationsForEntity(getValidationsForVariableType(variableType), entity)
  .map((validation) => ({ label: validation, value: validation }));

export {
  getValidationsForVariableType,
  getValidationOptionsForVariableType,
  isValidationWithNumberValue,
  isValidationWithListValue,
  isValidationWithoutValue,
  VALIDATIONS,
};

export default VALIDATIONS;
