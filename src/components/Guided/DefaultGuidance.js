import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { propTypes, defaultProps } from './guidedProps';

const DefaultGuidance = ({
  isActive,
  showGuidance,
  resetGuidance,
  toggleGuidance,
  anyActive,
  children, className, ...props
}) => {
  const sectionClasses = cx(
    className,
    'guided-default-guidance',
    {
      'guided-default-guidance--is-active': !anyActive,
    },
  );

  return (
    <div
      className={sectionClasses}
      {...props}
    >
      <h3>DefaultGuidance</h3>
      { children }
      <div
        className="guided-default-guidance__toggle"
        onClick={() => { toggleGuidance(); }}
      >‹</div>
    </div>
  );
};

DefaultGuidance.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  ...propTypes,
};

DefaultGuidance.defaultProps = {
  children: null,
  className: '',
  ...defaultProps,
};

export default DefaultGuidance;
