import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Button = ({
  children,
  className,
  type,
  ...props
}) => (
  <button
    className={cx('form-button', className)}
    type={type} // eslint-disable-line react/button-has-type
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  children: null,
  type: 'button',
};

export default Button;
