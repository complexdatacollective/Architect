/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';

const labelValue = option => (
  isArray(option) ?
    option :
    [option, option]
);

const SelectorDropDown = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  // if (options.length === 0) { return null; }

  return (
    <label className="selector-drop-down">
      <div className="selector-drop-down__value">{value !== '' ? value : placeholder}</div>
      <select
        value={value}
        onChange={onChange}
        className="selector-drop-down__options"
      >
        { placeholder && <option value="" disabled>{placeholder}</option> }
        {options.map(
          (option, index) => {
            const [optionValue, optionLabel] = labelValue(option);
            return <option key={index} value={optionValue}>{optionLabel}</option>;
          },
        )}
      </select>
    </label>
  );
};

SelectorDropDown.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SelectorDropDown.defaultProps = {
  placeholder: 'select',
};

export default SelectorDropDown;
