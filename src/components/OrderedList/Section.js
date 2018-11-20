import React from 'react';
import PropTypes from 'prop-types';

const Section = ({ children }) => (
  <div className="list-section">
    {children}
  </div>
);

Section.propTypes = {
  children: PropTypes.node,
};

Section.defaultProps = {
  children: null,
};

export default Section;
