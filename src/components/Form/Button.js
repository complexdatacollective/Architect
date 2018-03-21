import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Button = ({ children, className, ...props }) =>
  <button {...props} className={cx('form-button', className)}>{children}</button>;

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  children: null,
};

export default Button;
