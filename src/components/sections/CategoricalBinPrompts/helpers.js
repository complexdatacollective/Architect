/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';
import { formValueSelector } from 'redux-form';

export const getOptionsForVariable = (state, { entity, type, variable }) =>
  get(
    state,
    ['protocol', 'present', 'codebook', entity, type, 'variables', variable, 'options'],
  );


export const itemSelector = (entity, type) =>
  (state, { form, editField }) => {
    const prompt = formValueSelector(form)(state, editField);

    if (!prompt) { return {}; }

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
