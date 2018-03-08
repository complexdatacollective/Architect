import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Section = ({ children, isActive, onMouseOver, className, ...props }) => (
  <div
    onMouseEnter={onMouseOver}
    className={cx(className, 'guided-section', { 'guided-section--is-active': isActive })}
    {...props}
  >
    {
      React.Children.toArray(children)
        .map((child, index) => React.cloneElement(child, { isActive, key: index }))
    }
  </div>
);

Section.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  onMouseOver: PropTypes.func,
};

Section.defaultProps = {
  children: null,
  isActive: false,
  className: '',
  onMouseOver: () => {},
};

export default Section;
