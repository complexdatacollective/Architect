import { withPropsOnChange } from 'recompose';
import { get } from 'lodash';

const withFilteredFieldErrors = withPropsOnChange(
  ['errors', 'fieldId'],
  ({ errors, fieldId }) => ({
    errors: get(errors, fieldId),
  }),
);

export default withFilteredFieldErrors;
