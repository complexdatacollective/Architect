/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import cx from 'classnames';
import { withProps } from 'recompose';
import PropTypes from 'prop-types';

const inputTypes = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
};

/**
 * Convert variable type to input type
 */
const withMappedInputType = withProps(
  ({ type }) => ({
    type: type && inputTypes[type] ? inputTypes[type] : 'text',
  }),
);

const Input = ({
  value,
  type,
  onChange,
  className,
}) => (
  <label className={cx('rule-input', className, `rule-input--${type}`)}>
    <div className="rule-input__spacer">{ value }</div>
    <input
      className="rule-input__input"
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </label>
);

Input.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number', 'checkbox']),
};

Input.defaultProps = {
  className: null,
  onChange: () => {},
  value: '',
  type: 'text',
};

export default withMappedInputType(Input);
