import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Guidance = ({ isActive, children, className, ...props }) => (
  <div
    className={cx(className, 'guided-guidance', { 'guided-guidance--is-active': isActive })}
    {...props}
  >
    <h3>Help</h3>
    {children}
  </div>
);

Guidance.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

Guidance.defaultProps = {
  isActive: false,
  children: null,
  className: '',
};

export default Guidance;
