import { get, without } from 'lodash';

const VALIDATIONS = {
  text: [
    'required',
    'minLength',
    'maxLength',
    'unique',
    'differentFrom',
    'sameAs',
  ],
  number: [
    'required',
    'minValue',
    'maxValue',
    'unique',
    'differentFrom',
    'sameAs',
  ],
  datetime: [
    'required',
    'unique',
    'differentFrom',
    'sameAs',
  ],
  scalar: [
    'required',
    'unique',
    'differentFrom',
    'sameAs',
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
  ],
  categorical: [
    'required',
    'minSelected',
    'maxSelected',
    'unique',
    'differentFrom',
    'sameAs',
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
];

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
  VALIDATIONS,
};

export default VALIDATIONS;
