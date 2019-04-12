
import { formValueSelector } from 'redux-form';
import { omit, get, reduce } from 'lodash';
import { getCodebook } from '../../../selectors/protocol';

export const CODEBOOK_PROPERTIES = ['name', 'options'];

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

    const codebook = getCodebook(state);
    const variable = item && item.variable;
    const codebookConfiguration = get(codebook, [entity, type, 'variables', variable], {});
    const codebookProperties = getCodebookProperties(codebookConfiguration);

    return {
      ...item,
      ...codebookProperties,
    };
  };
