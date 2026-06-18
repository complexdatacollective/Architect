import useValidate from '@app/hooks/useValidate';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

const ValidatedFieldArray = ({ validation, ...rest }) => {
  const validate = useValidate(validation);

  return <FieldArray {...rest} validate={validate} />;
};

ValidatedFieldArray.propTypes = {
  validation: PropTypes.object.isRequired,
};

export default ValidatedFieldArray;
