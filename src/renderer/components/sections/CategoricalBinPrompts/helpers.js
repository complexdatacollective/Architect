/* eslint-disable import/prefer-default-export */

import { formValueSelector } from 'redux-form';
import { getOptionsForVariable } from '../../../selectors/codebook';

export const itemSelector = (entity, type) => (state, { form, editField }) => {
  const prompt = formValueSelector(form)(state, editField);

  if (!prompt) { return null; }

  const variableOptions = getOptionsForVariable(
    state,
    { entity, type, variable: prompt.variable },
  );

  return {
    ...prompt,
    variableOptions,
  };
};

// Strip variableOptions
export const normalizeField = ({ variableOptions, ...prompt }) => prompt;
