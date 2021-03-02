import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { Icon } from '@codaco/ui';
import RichText from './RichText';


const RichTextField = ({
  input,
  meta: { error, invalid, touched },
  label,
  placeholder,
  autoFocus,
}) => {
  const id = useRef(uuid());

  const anyLabel = label;

  return (
    <div className="form-field-container">
      { anyLabel &&
        <h4>{anyLabel}</h4>
      }
      <div className="form-field-rich-text">
        <RichText
          id={id.current}
          value={input.value}
          onChange={input.onChange}
          placeholder={placeholder || label}
          autoFocus={autoFocus} // eslint-disable-line
        />
        {invalid && touched && <div className="form-field-text__error"><Icon name="warning" />{error}</div>}
      </div>

    </div>
  );
};

RichTextField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.bool,
    invalid: PropTypes.bool,
    touched: PropTypes.bool,
  }).isRequired,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
};

RichTextField.defaultProps = {
  autoFocus: false,
  placeholder: null,
  label: null,
};

export default RichTextField;
