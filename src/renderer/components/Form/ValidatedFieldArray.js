import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import useValidate from '@app/hooks/useValidate';

const ValidatedFieldArray = ({
  validation,
  ...rest
}) => {
  const validate = useValidate(validation);

  return (
    <FieldArray
      {...rest} // eslint-disable-line react/jsx-props-no-spreading
      validate={validate}
    />
  );
};

ValidatedFieldArray.propTypes = {
  validation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ValidatedFieldArray;
