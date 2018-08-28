import { isEmpty } from 'lodash';

const CSSVariable = (variableName) => {
  const variable = getComputedStyle(document.body)
    .getPropertyValue(variableName)
    .trim();
  // eslint-disable-next-line no-console
  if (isEmpty(variable)) { console.log(`CSS variable "${variableName}" not found.`); }
  return variable;
};

export const getCSSVariableAsString = variableName =>
  CSSVariable(variableName);

export const getCSSVariableAsNumber = variableName =>
  parseInt(CSSVariable(variableName), 10);

export const getCSSVariableAsObject = variableName =>
  JSON.parse(CSSVariable(variableName));

export const getCSSVariable = (variableName) => {
  const variable = CSSVariable(variableName);

  try {
    return JSON.parse(variable);
  } catch (e) {
    if (parseInt(variable, 10).toString() === variable) {
      return parseInt(variable, 10);
    }

    return variable;
  }
};
