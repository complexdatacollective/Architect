import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';
import { Icon } from '@codaco/ui';

const dashIndex = [4, 7];

// - ignore dashes (they are auto-populated)
// - ignore letters
const filterInput = (currentValue) => (e) => {
  const ignoreList = 'abcdefghijklmnopqrstuvwxyz-'.split('');
  if (dashIndex.includes(currentValue.length) && e.key === '-') {
    return;
  }
  if (!ignoreList.includes(e.key)) { return; }
  e.preventDefault();
};

const getParsedValue = (dateFormat) => (value = '', previousValue = '') => {
  const parsedValue = value.split('')
    .slice(0, dateFormat.length)
    .map((char, index) => {
      if (dashIndex.includes(index)) { return '-'; }
      return parseInt(char, 10) || '0';
    })
    .join('');

  if (
    dashIndex.includes(value.length)
      && previousValue.length < value.length
      && value.length < dateFormat.length
  ) {
    return `${parsedValue}-`;
  }

  return parsedValue;
};

const TextInput = ({
  input,
  meta: {
    error, active, invalid, touched,
  },
  label,
  fieldLabel,
  className,
  autoFocus,
  hidden,
  dateFormat,
}) => {
  const id = useRef(uuid());

  useEffect(() => {
    const newValue = getParsedValue(dateFormat)(input.value);
    input.onChange(newValue);
  }, [dateFormat]);

  const seamlessClasses = cx(
    className,
    'form-field-text',
    {
      'form-field-text--has-focus': active,
      'form-field-text--has-error': invalid && touched && error,
    },
  );

  const anyLabel = fieldLabel || label;

  const handleChange = (e) => {
    const newValue = e.target.value;
    const parsedValue = getParsedValue(dateFormat)(newValue, input.value);
    input.onChange(parsedValue);
  };

  return (
    <div className="form-field-container" hidden={hidden}>
      { anyLabel
        && <h4>{anyLabel}</h4>}
      <div className={seamlessClasses}>
        <input
          id={id.current}
          name={input.name}
          className="form-field form-field-text form-field-text__input"
          placeholder={dateFormat.toUpperCase()}
          autoFocus={autoFocus} // eslint-disable-line
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...input}
          onKeyDown={filterInput(input.value)}
          onChange={handleChange}
        />
        {invalid && touched && (
        <div className="form-field-text__error">
          <Icon name="warning" />
          {error}
        </div>
        ) }
      </div>

    </div>

  );
};

TextInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
  label: PropTypes.string,
  autoFocus: PropTypes.bool,
  fieldLabel: PropTypes.string,
  dateFormat: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  hidden: PropTypes.bool,
};

TextInput.defaultProps = {
  input: {},
  meta: {},
  autoFocus: false,
  dateFormat: 'YYYY-MM-DD',
  label: null,
  fieldLabel: null,
  placeholder: '',
  className: '',
  hidden: false,
};

export default TextInput;
