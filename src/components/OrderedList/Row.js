import React from 'react';
import PropTypes from 'prop-types';

const Row = ({ children }) => (
  <div className="list-row">
    {children}
  </div>
);

Row.propTypes = {
  children: PropTypes.node,
};

Row.defaultProps = {
  children: null,
};

export default Row;
