import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Section = ({
  className,
  handleMouseEnter,
  handleMouseLeave,
  children,
}) => {
  const sectionClasses = cx(
    className,
    'guided-section',
  );

  return (
    <div
      className={sectionClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      { children }
    </div>
  );
};

Section.propTypes = {
  className: PropTypes.string,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  children: PropTypes.node,
};

Section.defaultProps = {
  className: '',
  handleMouseEnter: () => {},
  handleMouseLeave: () => {},
  children: null,
};

export default Section;
