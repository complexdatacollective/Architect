import { formValueSelector } from 'redux-form';
import { omit, get, reduce } from 'lodash';
import { getVariablesForSubject } from '@selectors/codebook';

export const CODEBOOK_PROPERTIES = ['options', 'parameters', 'component', 'validation'];

export const getCodebookProperties = (properties) => reduce(
  CODEBOOK_PROPERTIES,
  (memo, key) => {
    const property = properties[key];
    if (!Object.keys(properties).includes(key)) { return memo; }
    return {
      ...memo,
      [key]: property,
    };
  },
  {},
);

export const normalizeField = (field) => omit(field, ['id', ...CODEBOOK_PROPERTIES]);

// Merge item with variable info from codebook
export const itemSelector = (entity, type) => (state, { form, editField }) => {
  const item = formValueSelector(form)(state, editField);

  if (!item) { return null; }

  const variable = item && item.variable;

  const codebookVariables = getVariablesForSubject(state, { entity, type });
  const codebookVariable = get(codebookVariables, variable, {});
  const codebookProperties = getCodebookProperties(codebookVariable);

  return {
    ...item,
    ...codebookProperties,
  };
};
