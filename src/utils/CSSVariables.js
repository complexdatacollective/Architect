import { isEmpty } from 'lodash';

const getCSSVariable = (variableName) => {
  const variable = getComputedStyle(document.body)
    .getPropertyValue(variableName)
    .trim();
  // eslint-disable-next-line no-console
  if (isEmpty(variable)) { console.log(`CSS variable "${variableName}" not found.`); }
  return variable;
};

export const getCSSVariableAsString = variableName =>
  getCSSVariable(variableName);

export const getCSSVariableAsNumber = variableName =>
  parseInt(getCSSVariable(variableName), 10);

export const getCSSVariableAsObject = variableName =>
  JSON.parse(getCSSVariable(variableName));
