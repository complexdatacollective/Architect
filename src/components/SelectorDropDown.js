/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { isArray, find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';

const withLabels = (options) =>
  options.map(option => (isArray(option) ? option : [option, option]));

const getSpacer = (optionsWithLabels, placeholder, value) =>
  isEmpty(value) ?
    placeholder :  // return placeholder text
    find(optionsWithLabels, [0, value])[1];  // return matching label

const SelectorDropDown = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}) => {
  if (options.length === 0) {
    return <label className={cx('selector-drop-down', className)} ></label>;
  }

  const optionsWithLabels = withLabels(options);
  const spacer = getSpacer(optionsWithLabels, placeholder, value);

  return (
    <label className={cx('selector-drop-down', className)} >
      <div className="selector-drop-down__spacer">{ spacer }</div>
      <select
        value={value}
        onChange={onChange}
        className="selector-drop-down__options"
      >
        { placeholder && <option value="" disabled>{placeholder}</option> }
        {optionsWithLabels.map(
          ([optionValue, optionLabel], index) => {
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
  className: PropTypes.string,
};

SelectorDropDown.defaultProps = {
  placeholder: '',
  className: null,
};

export default SelectorDropDown;
