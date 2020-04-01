import { getFormValues } from 'redux-form';

export const getForms = formNames =>
  state =>
    formNames.reduce(
      (memo, formName) => ({
        ...memo,
        [formName]: getFormValues(formName)(state),
      }),
      {},
    );
