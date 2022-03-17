import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import useValidate from '@app/hooks/useValidate';

const ValidatedField = ({
  validation,
  ...rest
}) => {
  const validations = useValidate(validation);

  return (
    <Field
      {...rest} // eslint-disable-line react/jsx-props-no-spreading
      validate={validations}
    />
  );
};

ValidatedField.propTypes = {
  validation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ValidatedField;
