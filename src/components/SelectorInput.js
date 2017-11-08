/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const SelectorInput = ({
  value,
  onChange,
  className,
}) => (
  <label className={cx('selector-input', className)}>
    <input
      className="selector-input__text"
      type="text"
      value={value}
      onChange={onChange}
    />
  </label>
);

SelectorInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SelectorInput.defaultProps = {
  className: null,
};

export default SelectorInput;
