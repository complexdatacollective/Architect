
import { omit, get, reduce } from 'lodash';
import { getVariablesForSubject } from '../../../selectors/codebook';

export const CODEBOOK_PROPERTIES = ['options', 'component', 'validation'];

export const getCodebookProperties = properties =>
  reduce(
    CODEBOOK_PROPERTIES,
    (memo, key) => {
      const property = properties[key];
      if (!property) { return memo; }
      return {
        ...memo,
        [key]: property,
      };
    },
    {},
  );

export const normalizeField = field =>
  omit(field, ['id', ...CODEBOOK_PROPERTIES]);

// Merge item with variable info from codebook
export const itemSelector = (entity, type) =>
  (state, prompt) => {
    const variable = prompt.variable;

    const codebookVariables = getVariablesForSubject(state, { entity, type });
    const codebookVariable = get(codebookVariables, variable, {});
    const codebookProperties = getCodebookProperties(codebookVariable);

    return {
      ...prompt,
      ...codebookProperties,
    };
  };
