import { withPropsOnChange } from 'recompose';
import { isEqual } from 'lodash';
import { getValidations } from '../utils/validations';

const withValidation = withPropsOnChange(
  (props, nextProps) => !isEqual(props.validation, nextProps.validation),
  ({ validation }) => ({
    validate: getValidations(validation || []),
  }),
);

export default withValidation;
