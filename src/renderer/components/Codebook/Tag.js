import React from 'react';
import PropTypes from 'prop-types';

const Tag = ({ children, notUsed = false }) => {
  const classes = notUsed ? 'codebook__tag codebook__tag--not-used' : 'codebook__tag';
  return (<div className={classes}>{children}</div>);
};

Tag.propTypes = {
  children: PropTypes.node,
  notUsed: PropTypes.bool,
};

Tag.defaultProps = {
  children: null,
  notUsed: false,
};

export default Tag;
