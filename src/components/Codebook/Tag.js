import React from 'react';
import PropTypes from 'prop-types';

const Tag = ({ children }) => (<div className="codebook__tag">{children}</div>);

Tag.propTypes = {
  children: PropTypes.node,
};

Tag.defaultProps = {
  children: null,
};

export default Tag;
