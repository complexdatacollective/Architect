import { getFormValues, getFormNames } from 'redux-form';

/**
 * Returns the redux form values for the given form names.
 * If no form names are given, returns all form values.
 * @param {Array} formNames - names of forms to get values for
 * @returns {function} - selector function that returns an object of form values
 * keyed by form name
 */
export const getForms = (formNames) => (state) => {
  const reduce = (names) => names.reduce(
    (memo, formName) => ({
      ...memo,
      [formName]: getFormValues(formName)(state),
    }),
    {},
  );

  if (!formNames) {
    const allFormNames = getFormNames(state);
    return reduce(allFormNames);
  }

  return reduce(formNames);
};
