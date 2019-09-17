/* eslint-disable import/prefer-default-export */

import { getOptionsForVariable } from '../../../selectors/codebook';

export const itemSelector = (entity, type) =>
  (state, prompt) => {
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
