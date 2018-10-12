/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { isArray, find } from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';

const withLabels = options =>
  options.map(option => (isArray(option) ? option : [option, option]));

// Returns string used to give div correct width (hidden)
const getSpacer = (optionsWithLabels, placeholder, value) => {
  const option = find(optionsWithLabels, [0, value]);
  return option ? option[1] : placeholder;
};

const DropDown = ({
  options,
  onChange,
  placeholder,
  className,
  value,
}) => {
  if (options.length === 0) { return null; }

  const optionsWithLabels = withLabels(options);

  const spacer = getSpacer(optionsWithLabels, placeholder, value);

  return (
    <label className={cx('rule-drop-down', className)} >
      <div className="rule-drop-down__spacer">{ spacer }</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rule-drop-down__options"
      >
        { placeholder && <option value="" disabled>{placeholder}</option> }
        {optionsWithLabels.map(
          ([optionValue, optionLabel], index) =>
            <option key={index} value={optionValue}>{optionLabel}</option>,
        )}
      </select>
    </label>
  );
};

DropDown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

DropDown.defaultProps = {
  placeholder: '',
  className: null,
  value: '',
  onChange: () => {},
  options: [],
};

export default DropDown;
