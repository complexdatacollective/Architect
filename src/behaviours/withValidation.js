import { withPropsOnChange } from 'recompose';
import { getValidations } from '../utils/validations';

const withValidation = withPropsOnChange(
  ['validation'],
  ({ validation }) => ({
    validate: getValidations(validation || []),
  }),
);

export default withValidation;
