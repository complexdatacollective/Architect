import { pick } from 'lodash';

const DEFAULT_OPTIONS = {
  type: null,
  attribute: null,
  operator: null,
};

const DEFAULT_VALUES = {
  boolean: false,
  categorical: [],
};

const getDefaultValue = (variableType) => DEFAULT_VALUES[variableType] || '';

export const getDefaultOptions = (attributes, variableType) => {
  // generate default options object with all possible attributes
  const defaultOptions = {
    ...DEFAULT_OPTIONS,
    value: getDefaultValue(variableType),
  };

  if (!attributes) { return defaultOptions; }

  // return attributes which match this options object
  return pick(defaultOptions, attributes);
};

export const makeGetOptionsWithDefaults = (attributes, variableType) => (options) => ({
  ...getDefaultOptions(attributes, variableType),
  ...options,
});
