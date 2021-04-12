import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';

const FieldError = ({ error, show }) => {
  const errorClasses = cx(
    'form-field-error',
    { 'form-field-error--show': show },
  );

  return (
    <div className={errorClasses}>
      <Icon name="warning" />
      {' '}
      { error }
    </div>
  );
};

FieldError.propTypes = {
  error: PropTypes.string,
  show: PropTypes.bool,
};

FieldError.defaultProps = {
  show: false,
  error: null,
};

export default FieldError;
