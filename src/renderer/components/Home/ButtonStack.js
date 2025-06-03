import React from 'react';
import PropTypes from 'prop-types';

const ButtonStack = ({ children }) => (
  <div className="button-stack">
    {children}
  </div>
);

ButtonStack.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ButtonStack;
