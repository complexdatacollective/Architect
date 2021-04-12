import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { range } from 'lodash';
import { fieldPropTypes } from 'redux-form';
import Icon from '@codaco/ui/lib/components/Icon';

const asColorOption = (name) => ({
  label: name,
  value: name,
});

const ColorPicker = ({
  palette,
  paletteRange,
  options,
  input,
  label,
  meta: { error, invalid, touched },
}) => {
  const colors = palette
    ? range(1, paletteRange)
      .map((index) => asColorOption(`${palette}-${index}`))
    : options;

  const handleClick = (value) => {
    input.onChange(value);
  };

  const renderColor = (color) => {
    const colorClasses = cx(
      'form-fields-color-picker__color',
      { 'form-fields-color-picker__color--selected': input.value === color.value },
    );

    return (
      <div
        className={colorClasses}
        onClick={() => handleClick(color.value)}
        style={{ '--color': `var(--${color.value})` }}
        key={color.value}
      >
        <div className="form-fields-color-picker__color-label">{color.label}</div>
      </div>
    );
  };

  const showError = invalid && touched && error;

  const pickerStyles = cx(
    'form-fields-color-picker',
    { 'form-fields-color-picker--has-error': showError },
  );

  return (
    <div className="form-field-container">
      <div className={pickerStyles}>
        { label
          && <div className="form-fields-color-picker__label">{label}</div>}
        <div className="form-fields-color-picker__edit">
          <div className="form-fields-color-picker__colors">
            {colors.map(renderColor)}
          </div>
        </div>
        {showError
          && (
          <div className="form-fields-color-picker__error">
            <Icon name="warning" />
            {error}
          </div>
          )}
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  ...fieldPropTypes,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  paletteRange: PropTypes.number,
};

ColorPicker.defaultProps = {
  options: [],
  paletteRange: 0,
};

export default ColorPicker;
