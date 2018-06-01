import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { propTypes, defaultProps } from './guidedProps';

const Guidance = ({
  isActive,
  showGuidance,
  resetGuidance,
  toggleGuidance,
  anyActive,
  children,
  className,
  ...props
}) => (
  <div
    className={cx(className, 'guided-guidance', { 'guided-guidance--is-active': isActive })}
    {...props}
  >
    <h3>Help</h3>
    {children}
  </div>
);

Guidance.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  ...propTypes,
};

Guidance.defaultProps = {
  children: null,
  className: '',
  ...defaultProps,
};

export default Guidance;
