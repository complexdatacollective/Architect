
import { formValueSelector } from 'redux-form';
import { omit, reduce } from 'lodash';
import { getVariable } from '@selectors/codebook';

export const CODEBOOK_PROPERTIES = ['options', 'component', 'validation'];

// TODO: is this used anywhere, is it needed here?
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
  (state, { form, editField }) => {
    const item = formValueSelector(form)(state, editField);

    if (!item) { return null; }

    const variable = item && item.variable;

    const codebookVariable = getVariable(state, { id: variable });

    return {
      ...item,
      ...getCodebookProperties(codebookVariable.properties),
    };
  };
