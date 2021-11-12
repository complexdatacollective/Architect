import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import useValidate from '@app/hooks/useValidate';

const ValidatedField = ({
  validation,
  ...rest
}) => {
  const validate = useValidate(validation);

  return (
    <Field
      {...rest} // eslint-disable-line react/jsx-props-no-spreading
      validate={validate}
    />
  );
};

ValidatedField.propTypes = {
  validation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ValidatedField;
