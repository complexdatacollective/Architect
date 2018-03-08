import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Edit = ({ isActive, children, className, ...props }) => (
  <div
    className={cx(className, 'guided-edit', { 'guided-edit--is-active': isActive })}
    {...props}
  >
    {children}
  </div>
);

Edit.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

Edit.defaultProps = {
  isActive: false,
  className: '',
  children: null,
};

export default Edit;
