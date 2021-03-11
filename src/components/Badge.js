import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ color, children }) => {
  const style = color
    ? { backgroundColor: color }
    : {};

  return (
    <div className="badge" style={style}>
      {children}
    </div>
  );
};

Badge.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};

Badge.defaultProps = {
  color: null,
  children: null,
};

export default Badge;
