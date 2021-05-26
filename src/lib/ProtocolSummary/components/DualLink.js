import React from 'react';
import PropTypes from 'prop-types';
import { HashLink } from 'react-router-hash-link';

const DualLink = ({ to, children, className }) => (
  <>
    <HashLink smooth to={to} data-print="no" className={className}>{children}</HashLink>
    <a href={to} data-print="only" className={className}>{children}</a>
  </>
);

DualLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

DualLink.defaultProps = {
  children: null,
  className: null,
};

export default DualLink;
