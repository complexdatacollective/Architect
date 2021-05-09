import React from 'react';
import { HashLink } from 'react-router-hash-link';

const DualLink = ({ to, children }) => (
  <>
    <HashLink smooth to={to} data-print="no">{children}</HashLink>
    <a href={to} data-print="only">{children}</a>
  </>
);

export default DualLink;
