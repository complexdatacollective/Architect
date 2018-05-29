import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Overview = ({ children, anyActive, toggleGuidance, className, showGuidance, ...props }) => {
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
      <h3>Overview</h3>
      { children }
      <div
        className="guided-default-guidance__toggle"
        onClick={() => { toggleGuidance(); }}
      >x</div>
    </div>
  );
};

Overview.propTypes = {
  children: PropTypes.node,
  anyActive: PropTypes.bool,
  className: PropTypes.string,
  showGuidance: PropTypes.func,
  toggleGuidance: PropTypes.func,
};

Overview.defaultProps = {
  children: null,
  anyActive: false,
  className: '',
  showGuidance: () => {},
  toggleGuidance: () => {},
};

export default Overview;
