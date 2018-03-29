import { get } from 'lodash';

const mockCSSVariables = {
  '--light-background': '#227733',
  '--color-mustard': '#117733',
  '--white': '#fff',
  '--animation-duration-slow-ms': '300',
  '--animation-duration-fast-ms': '100',
};

const getCSSVariable = (cssVariableName) => {
  const variable = get(mockCSSVariables, cssVariableName);
  if (!variable) throw new Error(`CSS variable "${cssVariableName}" not found`);
  return variable;
};

export const getCSSVariableAsString = variableName =>
  getCSSVariable(variableName);

export const getCSSVariableAsNumber = variableName =>
  parseInt(getCSSVariable(variableName), 10);

export const getCSSVariableAsObject = variableName =>
  JSON.parse(getCSSVariable(variableName));
