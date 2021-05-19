/* eslint-disable react/jsx-props-no-spreading */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';
import { fieldPropTypes } from 'redux-form';

const Radio = ({
  label,
  className,
  input,
  disabled,
  fieldLabel,
  ...rest
}) => {
  const id = useRef(uuid());

  const componentClasses = cx(
    'form-field-radio',
    className,
    {
      'form-field-radio--disabled': disabled,
    },
  );

  return (
    <label className={componentClasses} htmlFor={id.current}>
      <input
        type="radio"
        className="form-field-radio__input"
        id={id.current}
        // input.checked is only provided by redux form if type="checkbox" or type="radio" is
        // provided to <Field />, so for the case that it isn't we can rely on the more reliable
        // input.value
        checked={!!input.value}
        {...input}
        {...rest}
      />
      <div className="form-field-radio__radio" />
      {label}
    </label>
  );
};

Radio.propTypes = {
  label: PropTypes.node,
  fieldLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  ...fieldPropTypes,
};

Radio.defaultProps = {
  className: '',
  label: null,
  fieldLabel: null,
  disabled: false,
};

export default Radio;
