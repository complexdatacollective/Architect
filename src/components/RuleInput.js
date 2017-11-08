/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const RuleInput = ({
  value,
  onChange,
  className,
}) => (
  <label className={cx('rule-input', className)}>
    <input
      className="rule-input__text"
      type="text"
      value={value}
      onChange={onChange}
    />
  </label>
);

RuleInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

RuleInput.defaultProps = {
  className: null,
};

export default RuleInput;
