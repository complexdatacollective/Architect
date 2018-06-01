import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { propTypes, defaultProps } from './guidedProps';

const Section = ({
  children,
  isActive,
  anyActive,
  show,
  className,
  showGuidance,
  toggleGuidance,
  resetGuidance,
  ...props
}) => {
  const sectionClasses = cx(
    className,
    'guided-section',
    {
      'guided-section--is-active': isActive,
      'guided-section--hide': !show,
    },
  );

  return (
    <div
      className={sectionClasses}
      {...props}
    >
      {
        React.Children.toArray(children)
          .map((child, index) => React.cloneElement(
            child, { isActive, key: index, showGuidance, anyActive, toggleGuidance, resetGuidance },
          ))
      }
    </div>
  );
};

Section.propTypes = {
  className: PropTypes.string,
  show: PropTypes.bool,
  children: PropTypes.node,
  ...propTypes,
};

Section.defaultProps = {
  children: null,
  show: true,
  className: '',
  ...defaultProps,
};

export default Section;
