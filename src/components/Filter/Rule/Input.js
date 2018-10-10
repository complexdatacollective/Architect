/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Input = ({
  value,
  type,
  onChange,
  className,
}) => (
  <label className={cx('rule-input', className)}>
    <div className="rule-input__spacer">{ value }</div>
    <input
      className="rule-input__text"
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </label>
);

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number']),
};

Input.defaultProps = {
  className: null,
  onChange: () => {},
  value: '',
  type: 'text',
};

export default Input;
