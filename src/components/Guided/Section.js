import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { propTypes, defaultProps } from './guidedProps';

const Section = ({
  isActive,
  className,
  handleMouseEnter,
  handleMouseLeave,
  children,
}) => {
  const sectionClasses = cx(
    className,
    'guided-section',
    {
      'guided-section--is-active': isActive,
    },
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
  ...propTypes,
};

Section.defaultProps = {
  className: '',
  ...defaultProps,
};

export default Section;
