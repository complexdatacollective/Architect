import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Round = ({ icon, size, className, ...props }) => (
  <button
    className={cx('form-round-button', className, { [`form-round-button--${size}`]: !!size })}
    {...props}
  >{icon}</button>
);

Round.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
};

Round.defaultProps = {
  className: '',
  icon: null,
  size: 'default',
  type: 'button',
};

export default Round;
