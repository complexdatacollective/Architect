/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { isArray, find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';

const withLabels = options =>
  options.map(option => (isArray(option) ? option : [option, option]));

const getSpacer = (optionsWithLabels, placeholder, value) => (
  isEmpty(value) ?
    placeholder : // return placeholder text
    find(optionsWithLabels, [0, value])[1] // return matching label
);

const RuleDropDown = ({
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
        defaultValue=""
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rule-drop-down__options"
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

RuleDropDown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

RuleDropDown.defaultProps = {
  placeholder: '',
  className: null,
  value: '',
  onChange: () => {},
  options: [],
};

export default RuleDropDown;
