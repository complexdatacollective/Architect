/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const RuleInput = ({
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
      onChange={onChange}
    />
  </label>
);

RuleInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number']),
};

RuleInput.defaultProps = {
  className: null,
  onChange: () => {},
  value: '',
  type: 'text',
};

export default RuleInput;
