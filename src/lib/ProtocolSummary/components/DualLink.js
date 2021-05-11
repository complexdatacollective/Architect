import React from 'react';
import { HashLink } from 'react-router-hash-link';

const DualLink = ({ to, children, className }) => (
  <>
    <HashLink smooth to={to} data-print="no" className={className}>{children}</HashLink>
    <a href={to} data-print="only" className={className}>{children}</a>
  </>
);

export default DualLink;
