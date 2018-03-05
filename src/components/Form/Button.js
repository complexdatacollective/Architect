import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Button = ({ children, ...props }) =>
  <button {...props} className={cx('form-button', props.className)}>{children}</button>;

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
};

export default Button;
