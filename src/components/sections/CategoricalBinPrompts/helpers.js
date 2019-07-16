/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';
import { formValueSelector } from 'redux-form';

export const itemSelector = (entity, type) =>
  (state, { form, editField }) => {
    const prompt = formValueSelector(form)(state, editField);

    if (!prompt) { return {}; }

    const variableOptions = get(
      state,
      ['protocol', 'present', 'codebook', entity, type, 'variables', prompt.variable, 'options'],
    );

    return {
      ...prompt,
      variableOptions,
    };
  };

// Strip variableOptions
export const normalizeField = ({ variableOptions, ...prompt }) => prompt;
