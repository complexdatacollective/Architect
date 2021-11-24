import React from 'react';
import PropTypes from 'prop-types';

const Link = ({
  children,
  onClick,
}) => (
  <div className="link" onClick={onClick}>
    {children}
  </div>
);

Link.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  onClick: null,
};

export default Link;
