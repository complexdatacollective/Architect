/* eslint-disable */

import { withPropsOnChange } from 'recompose';
import { getValidations } from '../utils/validations';

const withValidation = withPropsOnChange(
  ['validation'],
  ({ validation, ...rest }) => ({
    validate: getValidations(validation),
    ...rest,
  }),
);

export default withValidation;
