import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Section = ({ children, isActive, show, onMouseOver, className, ...props }) => {
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
      onMouseEnter={onMouseOver}
      className={sectionClasses}
      {...props}
    >
      {
        React.Children.toArray(children)
          .map((child, index) => React.cloneElement(child, { isActive, key: index }))
      }
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  show: PropTypes.bool,
  onMouseOver: PropTypes.func,
};

Section.defaultProps = {
  children: null,
  isActive: false,
  show: true,
  className: '',
  onMouseOver: () => { console.log("where's my thing"); },
};

export default Section;
