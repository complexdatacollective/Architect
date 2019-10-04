/* eslint-disable import/prefer-default-export */

import { formValueSelector } from 'redux-form';
import { getVariableOptions } from '@selectors/codebook';

export const itemSelector = () =>
  (state, { form, editField }) => {
    const prompt = formValueSelector(form)(state, editField);

    if (!prompt) { return null; }

    const variableOptions = getVariableOptions(
      state,
      { id: prompt.variable },
    );

    return {
      ...prompt,
      variableOptions,
    };
  };

// Strip variableOptions
export const normalizeField = ({ variableOptions, ...prompt }) => prompt;
