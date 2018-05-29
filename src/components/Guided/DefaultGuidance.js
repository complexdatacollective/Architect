import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Overview = ({ children, anyActive, className, showGuidance, ...props }) => {
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
      { children }
    </div>
  );
};

Overview.propTypes = {
  children: PropTypes.node,
  anyActive: PropTypes.bool,
  className: PropTypes.string,
  showGuidance: PropTypes.func,
};

Overview.defaultProps = {
  children: null,
  anyActive: false,
  className: '',
  showGuidance: () => {},
};

export default Overview;
